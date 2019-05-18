const fs = require('fs');
const unzip = require('unzip');
const request = require('request');
const shp2json = require('shp2json');
const JSONStream = require('JSONStream');
const writeWildfire = require('./write-wildfires');


// DIRECTORIES & URLS
const shapefileDirectory = './current-fires';
const current_fires_shp = `${shapefileDirectory}/prot_current_fire_points.shp`;
const current_fire_url = 'https://pub.data.gov.bc.ca/datasets/2790e3f7-6395-4230-8545-04efb5a18800/prot_current_fire_points.zip'

// GOOGLE SHEETS
// https://docs.google.com/spreadsheets/d/1mg71j-P91H_PpA9OufEPIRrDgpK80nWpN1CKH9LlIBk/edit?usp=sharing
const spreadsheet_id = '1mg71j-P91H_PpA9OufEPIRrDgpK80nWpN1CKH9LlIBk';



let fireArray = [];

downloadAndUnzip()

// pretty self explanitory
function downloadAndUnzip() {
	request
		.get(current_fire_url)
		.on('error', err => {
			console.log(err);
		})
		.pipe(unzip.Extract({ path: shapefileDirectory }))
		.on('finish', () => {
			// console.log('Unzipped!');
			parseShapefile(current_fires_shp);
		});
}


// runs on each row of data
function parseFireData(data) {
	let fire = data.properties;
	fire.center = data.geometry.coordinates;
	fire.ignition_date = returnHumanReadableDate(fire.IGNITION_D);

	delete fire.IGNITION_D;

	// TO DO
	// 1. normalize CURRENT_SI to a range between X-XX


	fireArray.push(fire);
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
	const month_lookup = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	const month = month_lookup[parseInt(object.month) - 1];
	return `${month} ${object.day}, ${object.year}`;
}



