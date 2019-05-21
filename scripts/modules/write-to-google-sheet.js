const async = require('async');
const GoogleSpreadsheet = require('google-spreadsheet');
// const gSheetHelper = require('./google-sheets-helper');
const creds = require('./vs-wildfire-tracker-c63b0d5442bd.json');


let worksheets = [];


function writeWildfire(data, id, spreadsheet_id) {
	const doc = new GoogleSpreadsheet(spreadsheet_id);

	async.series([
		function setAuth(step) {
			doc.useServiceAccountAuth(creds, err => {
				if (err) throw err;
				step();
			});
		},
		function getWsInfo(step) {
			doc.getInfo((err, info) => {
			
				info.worksheets.filter(d => {
					worksheets.push(d.title);
				});

				// next step
				step();
			});
		},
		function updateOrAdd(step) {
			// console.log(worksheets)
			const id_index = getSheetIndex(worksheets, id);

			if (id_index === -1) {
				gSheetHelper.addSheet(data, id, step);
			} else {
				step();
			}
		},
		gSheetHelper.addRow(worksheets, id, step)
	]);
}


// function updateWildfire(step) {
// 			const id_index = getSheetIndex(worksheets, id);

// 			console.log('update ', id_index, worksheets.length);
			
// 			// sheets doesn't used a 0-based array. ugh.
// 			doc.addRow(id_index + 1, data, (err, row) => {
// 				if (err) throw err;
// 			});
// 		}
// function addSheet(data, id, step) {
// 	const headers = Object.keys(data);

// 	doc.addWorksheet({
// 		title: id,
// 	}, (err, sheet) => {
// 		sheet.setHeaderRow(headers, () => {
// 			// once headers are set, add the row
// 			sheet.addRow(data, (err) => {
// 				if (err) throw err;
// 			})
// 		});
// 	});
// }

// function getSheetIndex(worksheets, id) {
// 	return worksheets.indexOf(id.toString());
// }

module.exports = writeWildfire;