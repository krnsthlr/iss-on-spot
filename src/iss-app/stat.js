'use strict';

const http = require('http');

const getNumber = (filter) => {

	return new Promise((resolve, reject) => {

		const request = http.get('http://localhost:3000/api/tweets?filter=' + filter, (res) => {

			//handle http errors
			if(res.statusCode < 200 || res.statusCode > 299){
				reject(new Error('Failed to get number: ' + res.statusCode));
			}

			let rawData = '';
			res.on('data', (chunk) => {rawData += chunk});
			res.on('end', () => {
				try {
					const result = JSON.parse(rawData);
					if(filter === 'day') resolve({ day: result });
					if(filter === 'week') resolve({ week: result });
					if(filter === 'month') resolve({ month: result });
				} catch(e) {
					reject(e);
				}
			});
		});

		//handle connection errors on the request
		request.on('error', (err) => reject(err));
	});
};

module.exports.getNumber = getNumber;