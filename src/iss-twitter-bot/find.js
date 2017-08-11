'use strict';

const googleGeocode = 'AIzaSyA4TFNyuNBcQeMQs6kt0JVAxCZv-Y-fGLc';
const googleTimezone = 'AIzaSyAZHmK0N77EK4PjDLmPU1Ir3AHZGp8IR2k';

const http = require('http');
const https = require('https');
const moment = require('moment');

/**
* ------------------------------------------------------------------------
* Convert a location (string) to geographic coordinates,
* return latitude and longitude
* ------------------------------------------------------------------------
*/

const getCoordinates = (location) => {

	return new Promise((resolve, reject) => {

		const request = https.get('https://maps.googleapis.com/maps/api/geocode/json?address=' 
			+ encodeURIComponent(location) + '&key=' + googleGeocode, (res) => {

				//handle http errors
				if(res.statusCode < 200 || res.statusCode > 299){
					reject(new Error('Failed to get coordinates: ' + res.statusCode));
				}

				let rawData = '';
				res.on('data', (chunk) => {rawData += chunk});
				res.on('end', () => {
					try {
						const result = JSON.parse(rawData);
						resolve(result.results[0].geometry.location);
					} catch(e) {
						reject(e);
					}
				});
			});

		//handle connection errors on the request
		request.on('error', (err) => reject(err));
	})
}

/**
* ------------------------------------------------------------------------
* Get the next ISS pass time for a latitude/longitude pair,
* (returns the request params and a list of passes) 
* ------------------------------------------------------------------------
*/

const getPassTimes = (coordinates) => {

	return new Promise((resolve, reject) => {

		const request = http.get('http://api.open-notify.org/iss-pass.json?lat=' 
			+ coordinates.lat + '&lon=' + coordinates.lng, (res) => {

				//handle http errors
				if(res.statusCode < 200 || res.statusCode > 299){
					reject(new Error('Failed to get ISS pass times: ' + res.statusCode));
				}

				let rawData = '';
				res.on('data', (chunk) => {rawData += chunk});
				res.on('end', () => {
					try {
						const result = JSON.parse(rawData);
						resolve(result);
					} catch(e) {
						reject(e);
					}	
				});
		});
		//handle connection errors on the request
		request.on('error', (err) => reject(err));
	})
};

/**
* ------------------------------------------------------------------------
* Look up the timezone by latitude/longitude, 
* return (local) time and duration of the next ISS pass
* ------------------------------------------------------------------------
*/

const getLocalTime = (data) => {

	let timestamp = data.response[0].risetime;
	let duration = data.response[0].duration;

	return new Promise((resolve, reject) => {

		const request = https.get('https://maps.googleapis.com/maps/api/timezone/json?location='
			+ data.request.latitude + ',' + data.request.longitude
			+'&timestamp=' + timestamp + '&key=' + googleTimezone, (res) => {

				//handle http errors
				if(res.statusCode < 200 || res.statusCode > 299){
					reject(new Error('Failed to get timezone: ' + res.statusCode));
				}

				let rawData = '';
				res.on('data', (chunk) => {rawData += chunk});
				res.on('end', () => {
					try {
						const result = JSON.parse(rawData);
						if(result.dstOffset != 0) timestamp += result.dstOffset;
						else if(result.dstOffset === 0) timestamp += result.rawOffset;
						let time = moment.utc(timestamp * 1000).format("dddd, MMMM Do YYYY, h:mm:ss a");
						resolve({
							'time': time,
							'duration': duration
						});
					} catch(e) {
						reject(e);
					}
				});

			});
		//handle connection errors on the request
		request.on('error', (err) => reject(err));
	});
};

module.exports.coordinates = getCoordinates;
module.exports.passTimes = getPassTimes;
module.exports.localTime = getLocalTime;