const fs = require('fs');
const unzip = require('unzip');
const request = require('request');
const shp2json = require('shp2json');
// var CronJob = require('cron').CronJob;
const JSONStream = require('JSONStream');
const writeWildfire = require('./modules/write-wildfires');
// const writeWildfire = require('./modules/scrape-fire');


// DIRECTORIES & URLS
const shapefileDirectory = './current-fires';
const current_fires_shp = `${shapefileDirectory}/prot_current_fire_points.shp`;
const current_fire_url = 'https://pub.data.gov.bc.ca/datasets/2790e3f7-6395-4230-8545-04efb5a18800/prot_current_fire_points.zip'

// GOOGLE SHEETS
// https://docs.google.com/spreadsheets/d/1mg71j-P91H_PpA9OufEPIRrDgpK80nWpN1CKH9LlIBk/edit?usp=sharing
const spreadsheet_id = '1mg71j-P91H_PpA9OufEPIRrDgpK80nWpN1CKH9LlIBk';
let fireArray = [];
let fire_links = [];




// kick things off
downloadAndUnzip();
// run very hour at quarter past
// new CronJob('15 * * * *', function() {
// 	const date = new Date();

// 	console.log(`Current time is ${date.getHours()}:${date.getMinutes()}`);
	
// 	downloadAndUnzip();
// }, null, true, 'America/Los_Angeles');




// pretty self explanitory
function downloadAndUnzip() {
	request
		.get(current_fire_url)
		.on('error', err => {
			console.log(err);
		})
		.pipe(unzip.Extract({ path: shapefileDirectory }))
		.on('finish', () => {
			console.log('Unzipped!');

			// hack-y....
			setTimeout(() => {
				parseShapefile(current_fires_shp);	
			}, 10000);
			
		});
}

// runs on each row of data
function parseFireData(data) {
	let fire = data.properties;
	
	fire.last_update = Date.now();
	fire.ignition_date = returnHumanReadableDate(fire.IGNITION_D);
	
	// CURRENT_SI needs a value & sometimes comes back empty
	if (fire.CURRENT_SI === null) {
		fire.CURRENT_SI = 0;
	}
	fireArray.push(fire);

	// collect links for 'Fires of note'
	if (fire.FIRE_NT_LK) {
		fire_links.push(fire.FIRE_NT_LK);
	}

	// this is an array so doesn't transfer to google sheet
	delete fire.IGNITION_D;
}

function parseShapefile(shapefile) {
	const jStream = JSONStream.parse(['features', true]);

	shp2json.fromShpFile(shapefile)
		.pipe(jStream
				.on('data', d => {
					parseFireData(d);
				})
				.on('end', d => {
					writeWildfire(fireArray, spreadsheet_id);
				})
		);
}

function returnHumanReadableDate(object) {
	const month = returnUTCMonth(parseInt(object.month) - 1);
	return `${month} ${object.day}, ${object.year}`;
}

function returnUTCMonth(month_num) {
	const month_lookup = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	return month_lookup[parseInt(month_num)];
}



