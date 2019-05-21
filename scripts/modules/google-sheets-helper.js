const GoogleSpreadsheet = require('google-spreadsheet');


module.exports = function gSheetHelper() {
	this.addRow = function(worksheets, id, step) {
		const id_index = this.getSheetIndex(worksheets, id);

		console.log('update ', id_index, worksheets.length);
		
		// sheets doesn't used a 0-based array. ugh.
		doc.addRow(id_index + 1, data, (err, row) => {
			if (err) throw err;
		});
	},
	this.addSheet = function(data, id, step) {
		const headers = Object.keys(data);

		doc.addWorksheet({
			title: id,
		}, (err, sheet) => {
			sheet.setHeaderRow(headers, () => {
				// once headers are set, add the row
				sheet.addRow(data, (err) => {
					if (err) throw err;
				})
			});
		});
	},
	this.getSheetIndex = function(worksheets, id) {
		return worksheets.indexOf(id.toString());
	},
	this.setAuth = function(creds, doc, step) {
		doc.useServiceAccountAuth(creds, err => {
			if (err) throw err;
			step();
		});
	},
	this.worksheets = []
};
