const fs = require('fs');
const async = require('async');
const unzip = require('unzip');
const request = require('request');
const shp2json = require('shp2json');
const Parser = require('rss-parser');
const CronJob = require('cron').CronJob;
const JSONStream = require('JSONStream');
const writeWildfire = require('./modules/write-wildfires');
const fetchFire = require('./modules/fetch-fire');
const writeFireOfNote = require('./modules/write-fire-of-note');
const creds = require('./modules/vs-wildfire-tracker-c63b0d5442bd.json');
const gSheetHelper = require('./modules/google-sheets-helper');


// DIRECTORIES & URLS
const shapefileDirectory = './current-fires';
const current_fires_shp = `${shapefileDirectory}/prot_current_fire_points.shp`;
const current_fire_url = 'https://pub.data.gov.bc.ca/datasets/2790e3f7-6395-4230-8545-04efb5a18800/prot_current_fire_points.zip';
const wildfire_rss_feed = 'http://bcfireinfo.for.gov.bc.ca/FTP/!Project/WildfireNews/xml/All-WildfireNews.xml';

// GOOGLE SHEETS
// https://docs.google.com/spreadsheets/d/1mg71j-P91H_PpA9OufEPIRrDgpK80nWpN1CKH9LlIBk/edit?usp=sharing
const spreadsheet_id = '1mg71j-P91H_PpA9OufEPIRrDgpK80nWpN1CKH9LlIBk';
const fire_of_note_spreadsheet_id = '1QLomki7aY5ZF4zhETtC40GRnSO7BcnwpqJMQxbUSLPQ';

// 
// parser for the wildfire RSS feed
const parser = new Parser({
	headers: { Accept: '*/*' }
});

let fireArray = [];
let fire_links = [];



// kick things off

// delete this before commits
updateWildfireData();

// run every hour at quarter past
// new CronJob('15 * * * *', function() { updateWildfireData(); }, null, true, 'America/Los_Angeles');




// pretty self explanitory
async function updateWildfireData() {
	// get RSS feed for fires of note
	const fon_ids = await parseRssFeed(wildfire_rss_feed);

	console.log(fon_ids)

	// download and unzip
	request
		.get(current_fire_url)
		.on('error', err => {
			console.log(err);
		})
		.pipe(unzip.Extract({ path: shapefileDirectory }))
		.on('finish', () => {
			console.log('Shapefile downloaded & unzipped');

			// hack-y....
			setTimeout(() => {
				// convert shape to json
				parseShapefile(current_fires_shp, fon_ids);
			}, 10000);
			
		});

	
}

async function parseRssFeed(rss_feed) {
	try {
		let feed = await parser.parseURL(rss_feed);

		feed.items.forEach(item => {
			const fire_id = parseInt(item.link.split('ID=')[1]);
			fire_links.push(fire_id);
		});

		// updateFiresOfNote(fire_links);
		return fire_links;
	} catch(err) {
		console.log(err);
	}
}

// runs on each row of data
function parseFireData(data, fon_ids) {
	let fire = data.properties;

	fire.last_update = Date.now();
	fire.fon = fon_ids.includes(parseInt(fire.FIRE_NT_ID));
	fire.ignition_date = returnHumanReadableDate(fire.IGNITION_D);
	fireArray.push(fire);

	// this is an array so doesn't transfer to google sheet
	delete fire.IGNITION_D;
}

function parseShapefile(shapefile, fon_ids) {
	const jStream = JSONStream.parse(['features', true]);

	shp2json.fromShpFile(shapefile)
		.pipe(jStream
				.on('data', d => {
					parseFireData(d, fon_ids);
				})
				.on('end', d => {
					// write fires to google sheet
					writeWildfire(fireArray, spreadsheet_id);
				})
				.on('error', err => {
					console.log(err);
				})
		);
}

function updateFiresOfNote(fire_links) {
	console.log(fire_links)
	let interval = 2000;
	// get google sheet that holds the FONs
	const doc = gSheetHelper.setAuth(creds, fire_of_note_spreadsheet_id);

	const writeFire = async function(fire_link) {
		console.log(fire_link);
		const fire_id = fire_link.split('?ID=')[1];
		const fire_data = await fetchFire(fire_link);
		
		// this whole promise thing isn't working..
		const result = await writeFireOfNote(doc, fire_data, fire_id);
	}

	// grab first url from the array
	const update = setInterval(function() {
		let fire = fire_links.shift()

		if (fire) {
			writeFire(fire);
		} else {
			clearInterval(update);
		}	
	}, interval);

}

function returnHumanReadableDate(object) {
	const month = returnUTCMonth(parseInt(object.month) - 1);
	return `${month} ${object.day}, ${object.year}`;
}

function returnUTCMonth(month_num) {
	const month_lookup = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	return month_lookup[parseInt(month_num)];
}



