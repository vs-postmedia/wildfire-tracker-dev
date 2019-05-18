const fs = require('fs');
const unzip = require('unzip');
const request = require('request');
const shp2json = require('shp2json');
const JSONStream = require('JSONStream');
// GOOGLE SHEETS
const async = require('async');
const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('../modules/vs-wildfire-tracker-c63b0d5442bd.json');


const spreadsheet_id = '1mg71j-P91H_PpA9OufEPIRrDgpK80nWpN1CKH9LlIBk';
const current_fire_url = 'https://pub.data.gov.bc.ca/datasets/2790e3f7-6395-4230-8545-04efb5a18800/prot_current_fire_points.zip'


const current_fires_shp = './current-fires/prot_current_fire_points.shp';


let fireArray = [];
parseShapefile(current_fires_shp)


function downloadAndUnzip() {
	request
		.get(current_fire_url)
		.on('error', err => {
			console.log(err)
		})
		.pipe(unzip.Extract({ path: './current-fires'}))

		// TO DO:
		// listen for 'end' event then call parseShapeFile
}



function parseFireData(data) {
	
	let fire = data.properties;
	fire.center = data.geometry.coordinates;

	console.log(fire)

	// TO DO
	// 1. normalize CURRENT_SI to a range between X-XX
	// 2. convert IGNITION_D into a human-readable date


	fireArray.push(fire);
	// writeWildfire(firearray, spreadsheet_id)
}

function parseShapefile(shapefile) {
	const jStream = JSONStream.parse(['features', true]);

	shp2json.fromShpFile(shapefile)
		.pipe(jStream
				.on('data', d => {
					parseFireData(d);
				})
				.on('end', d => {
					console.log('END')
					writeWildfire(fireArray, spreadsheet_id);
				})
		);
}

function writeWildfire(data, spreadsheet_id) {
	const doc = new GoogleSpreadsheet(spreadsheet_id);

	async.series([
		function setAuth(step) {
			doc.useServiceAccountAuth(creds, err => {
				if (err) throw err;
				step();
			});
		},
		function updateWildfire(step) {			
			// sheets doesn't used a 0-based array. ugh.
			data.forEach((d, i) => {
				console.log(d)
				// doc.addRow(1, d, (err, row) => {
				// 	if (err) throw err;
				// });
			})
		}
	]);
}
