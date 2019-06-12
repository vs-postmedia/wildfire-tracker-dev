const GoogleSpreadsheet = require('google-spreadsheet');


const gSheetHelper = {
	addRowX: function(worksheets, id, step) {
		const id_index = this.getSheetIndex(worksheets, id);

		console.log('update ', id_index, worksheets.length);
		
		// sheets doesn't used a 0-based array. ugh.
		doc.addRow(id_index + 1, data, (err, row) => {
			if (err) throw err;
		});
	},
	addRow: function(sheet, data) {
		sheet.addRow(data, (err, resp) => {
			if (err) throw err;

			console.log(`Row written`);
		})
	},
	addSheet: function(data, id, step) {
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
	getSheetIndex: function(worksheets, id) {
		return worksheets.indexOf(id.toString());
	},
	getWorksheetInfo: async (doc) => {
		let worksheets = [];

		return await doc.getInfo((err, info) => {
			if (err) throw err;
			// console.log(info.worksheets)
			return info;
			
		});
		
		// worksheets = doc.getInfo((err, info) => {
		// 	if (err) throw err; 
		// 	let ws = []
			
		// 	info.worksheets.filter(d => {
		// 		console.log(d.title)
		// 		// worksheets.push(d.title);
		// 		ws.push(d.title);
		// 	});

			
		// });

		// return worksheets;
		// return Promise.resolve(worksheets)
	},
	setAuth: (creds, spreadsheet_id) => {
		const doc = new GoogleSpreadsheet(spreadsheet_id);
		doc.useServiceAccountAuth(creds, err => {
			if (err) throw err;
			// step();
		});

		return doc
	},
	worksheets: []
};


module.exports = gSheetHelper;