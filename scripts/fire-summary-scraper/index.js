const rp = require('request-promise');
const cheerio = require('cheerio');
const writeToCsv = require('../modules/write-to-csv');

const file_path = './summary-data.csv';
const url = 'http://bcfireinfo.for.gov.bc.ca/hprScripts/WildfireNews/Statistics.asp';
const regions = ['coastal', 'northwest', 'prince_george', 'kamloops', 'southeast', 'cariboo'];


rp(url)
	.then(resp => {
		const table_data = parseSummaryTable(resp);

		console.log(table_data);

		const data_object = objectifyData(table_data);

		// writeToCsv({
		// 	append: 'a',
		// 	data: table_data,
		// 	file_path: file_path
		// });

		console.log(data_object)
	})
	.catch(err => {
		throw err;
	});

function objectifyData(data) {
	let array = [];
	let row = {
		date: data.date,
		year: data.date.split(', ')[1]
	}

	data.rows.forEach((d,i) => {
		console.log(d)
	})

	data.headers.forEach((d,i) => {
		console.log(d)
		 
	})
}

function parseSummaryTable(data) {
	let summary = {
		rows: [],
		headers: []
	};

	const $ = cheerio.load(data);
	const table = $('.portlet-content table');

	// get date
	summary.date = table.find('th').eq(0).text();

	// get headers
	table.find('th').each((i, d) => {
		i > 1 ? summary.headers.push($(d).text()) : null;
	});

	table.find('tr').each((i, d) => {
		// skip the first tr elem since it's a header
		if (i > 0) {
			let row = {};
			const text = $(d).text().replace(/\n/g, '').split('\t');
			// const key = text[1].replace(/\s/g, '-').split('(current')[0].toLowerCase();
			// summary.rows[key] = text.splice(3, text.length)

			row.title = text[1].replace(/\s/g, '-').split('(current')[0].toLowerCase();
			row.data = text.splice(3, text.length)
			summary.rows.push(row);
		}
	});
	
	return summary;
}