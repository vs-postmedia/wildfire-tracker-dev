const async = require('async');
const GoogleSpreadsheet = require('google-spreadsheet');
const gSheetHelper = require('./google-sheets-helper');



async function writeFireOfNote(doc, data, id) {
	doc.getInfo((err, info) => {
		const sheet = info.worksheets.filter(d => d.title === id );

		if (sheet.length > 0) {
		  // sheet exists, compare last_updated timestamp & updated if later
			const options = {
				offset: 0,
				orderby: 'last_updated'
			}
			// get the last row of the sheet
			sheet[0].getRows(options, (err, rows) => {
				const lastupdated = rows[rows.length - 1].lastupdated;

				// compare last update
				if (data.last_updated !== lastupdated) {
					// just use addRow function below?
					gSheetHelper.addRow(sheet[0], data);
				} else {
					console.log(`Fire ID ${id} already up-to-date.`)
				}
			});

			return 'New rows written'
		} else {
			// create new sheet & add row
			console.log(`Creating new worksheet for fire ID ${id}`)
			createWorksheet(doc, data, id);
		}
	});
}

function addRow(fire) {
	sheet.addRow(fire, (err, row) => {
		if (err) throw err;

		console.log(`Fire ID ${fire.fire_name} written`);
	});
}

function createWorksheet(doc, data, id) {
	const headers = Object.keys(data);
	
	doc.addWorksheet({
		title: id,
	}, (err, sheet) => {
		if (err) throw err;
		// set header row
		sheet.setHeaderRow(headers, () => {
			console.log('Headers written');
			// add row
			gSheetHelper.addRow(sheet, data);
		});
	});
}

module.exports = writeFireOfNote;