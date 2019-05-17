const rp = require('request-promise');
const cheerio = require('cheerio');
const writeGoogleSheet = require('../modules/write-to-google-sheet');
// const writeToCsv = require('../modules/write-to-csv');


// VARIABLES 
const url = 'http://bcfireinfo.for.gov.bc.ca/hprScripts/WildfireNews/Fires.asp?Mode=normal&AllFires=0&FC=0'
const url_frag = 'http://bcfireinfo.for.gov.bc.ca/hprScripts/WildfireNews/OneFire.asp?ID=';
const spreadsheet_id = '1QLomki7aY5ZF4zhETtC40GRnSO7BcnwpqJMQxbUSLPQ';

const required_fields = ['Last updated','Location','Discovered', 'Size','Status','Interface','Evacuation', 'Alert','Cause','Resources'];



fire_id = 794;
fire_url = `${url_frag}${fire_id}`;
console.log(fire_url);



rp(fire_url)
	.then(resp => {
		const fire_data = parseFireData(resp, fire_id);

		// const file_path = `./fire_${fire_id}.csv`;

		// writeToCsv({
		// 	append: 'w', // overwrite the file
		// 	data: fire_data,
		// 	file_path: file_path
		// });

		writeGoogleSheet(fire_data, fire_id, spreadsheet_id);
	})
	.catch(err => {
		console.log('ERROR: ', err )
	});

function parseFireData(data) {
	let fire = {};
	const $ = cheerio.load(data);

	fire.fire_name = $('.portlet h2').text();

	// loop through the required fields & populate our fire object
	const fields = $('.portlet-content b').filter((i, el) => {
		const field = $(el).text();
		
		if (required_fields.includes(field)) {
			
			if (field == 'Status') {
				const status_details = $(el).parents('p').text().replace(/•\s/g, '').split(/\n/g);
				fire.status_details = status_details.splice(0, status_details.length - 1);
				fire.status = fire.status_details.shift(1,1).split(': ')[1];
			} else if (field == 'Location') {
				fire.location =  $(el).parents('p').text().split(':')[1].split(/\n/)[0].trim();
			} else if (field == 'Cause') {
				fire.cause = $(el).parents('p').text().split(': ')[1].split(/\n/g)[0];
				fire.cause_detail = $(el).parents('p').text().split(/\n/)[1];
			} else if (field == 'Resources') {
				const resources = $(el).parents('p').text().replace(/•\s/g, '').split(/\n/g); 
				fire.resources = resources.splice(1, resources.length - 3);
			} else {
				fire[field.replace(/\s/g, '_').toLowerCase()] = $(el).parents('p').text().split(': ')[1].replace(/\n\t/g, '').trim();
			}
		}
	});

	return fire;
}


