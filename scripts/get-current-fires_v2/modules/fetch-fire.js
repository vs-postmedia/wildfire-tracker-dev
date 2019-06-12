const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');


// VARIABLES 
const required_fields = ['Last updated','Location','Discovered', 'Size','Status','Interface','Evacuation', 'Alert','Cause','Resources'];


async function fetchFire(url) {
	const fire_data = await rp(url)
		.then(resp => {
			const fire_data = parseFireData(resp);

			return fire_data;
		})
		.catch(err => {
			console.log('ERROR: ', err )
		});

	return fire_data;
}


function parseFireData(data) {
	let fire = {};
	const $ = cheerio.load(data);

	fire.fire_name = $('.portlet h2').text().split(' (')[0];

	// loop through the required fields & populate our fire object
	const fields = $('.portlet-content b').filter((i, el) => {
		const field = $(el).text();
		
		if (required_fields.includes(field)) {
			if (field == 'Status') {
				const status_detail_text = $(el).parents('p').text().split(/\n/g);
				// fire.status_details = status_detail_text.splice(0, status_detail_text.length - 1);
				// drop empty strings
				fire.status_details = status_detail_text.filter(d => d.length > 0);
				// get containment stats (if they exist)
				fire.containment = status_detail_text.filter(d => d.startsWith('• '))
				// status should be the first item in the array
				fire.status = fire.status_details.shift().split(': ')[1];
			} else if (field == 'Location') {
				fire.location =  $(el).parents('p').text().split(':')[1].split(/\n/)[0].trim();
			} else if (field == 'Cause') {
				fire.cause = $(el).parents('p').text().split(': ')[1].split(/\n/g)[0].trim();
				fire.cause_detail = $(el).parents('p').text().split(/\n/)[1];
			} else if (field == 'Resources') {
				const resources = $(el).parents('p').text().replace(/•\s/g, '').split(/\n/g); 
				fire.resources = resources.splice(1, resources.length - 3);
			} else {
				fire[field.replace(/\s/g, '_').toLowerCase()] = $(el).parents('p').text().split(': ')[1].replace(/\n\t/g, '').trim();
			}
		}
	});

	console.log(fire)

	return fire;
}

module.exports = fetchFire;

