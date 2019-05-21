// GOOGLE SHEETS
// https://docs.google.com/spreadsheets/d/1mg71j-P91H_PpA9OufEPIRrDgpK80nWpN1CKH9LlIBk/edit?usp=sharing
const async = require('async');
const GoogleSpreadsheet = require('google-spreadsheet');
// const gSheetHelper = require('../modules/google-sheets-helper');

const creds = require('../modules/vs-wildfire-tracker-c63b0d5442bd.json');
const spreadsheet_id = '1mg71j-P91H_PpA9OufEPIRrDgpK80nWpN1CKH9LlIBk';


function writeWildfire(data, spreadsheet_id) {
	const doc = new GoogleSpreadsheet(spreadsheet_id);

	async.series([
		function setAuth(step) {
			doc.useServiceAccountAuth(creds, err => {
				if (err) throw err;
				step();
			});
		},
		function createWorksheet(step) {
			const headers = Object.keys(data[0]);
			
			doc.addWorksheet({
				title: `current-wildfires-${Date.now()}`,
			}, (err, sheet) => {
				if (err) throw err;
				// set header row
				sheet.setHeaderRow(headers, () => {
					console.log('Headers written');
					
					step();
				});
			});
		},
		function updateWildfire(step) {
			const addRow = function(data, fire, sheet) {
				sheet.addRow(fire, (err, row) => {
					if (err) throw err;

					const fire = data.shift();
					if (fire) {
						console.log(`Fire ID ${fire.FIRE_ID} written`);
					}
					
					if (fire) {
						// settimeout required to give previous connection enough time to close. otherwise the following network error is generated:
						// `Client network socket disconnected before secure TLS connection was established`
						setTimeout(() => {
							addRow(data, fire, sheet);
						}, 100);
					} else {
						step();
					}
				});
			}

			doc.getInfo((err, info) => {
				const sheet = info.worksheets[info.worksheets.length - 1];
				const fire = data.shift();
				
				addRow(data, fire, sheet);
			});
		},
		function deleteWorksheet(step) {
			doc.getInfo((err, info) => {
				const sheet = info.worksheets[0];
				
				sheet.del(() => {
					console.log('Previous sheet deleted');
				});
			});
		}
	]);
}


module.exports = writeWildfire;