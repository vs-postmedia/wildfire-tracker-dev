const fs = require('fs');
const csvWriter = require('csv-write-stream');


function writeToCsv(obj) {
	let writer;
	
	if (fs.existsSync(obj.file_path)) {
		writer = csvWriter({ sendHeaders: false });
	} else {
		writer = csvWriter();
	}

	writer.pipe(fs.createWriteStream(obj.file_path, { flags: obj.append }));
	writer.write(obj.data);
	writer.end();
}

module.exports = writeToCsv;