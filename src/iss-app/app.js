'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const find = require('../iss-twitter-bot/find.js');
const app = express();

// set port
app.set('port', process.env.PORT || 5000);
// start serving static files
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('dev'));

app.post('/', (req, res) => {

	find.flyOver(req.body.location)
		.then((result) => {
			res.json({
				message: 'The ISS will be over ' + req.body.location 
				+ ' on ' + result.time + ' (local time) ' 
				+ 'for ' + result.duration + ' sec.'
			});
		})
		.catch((err) => {
			res.json({
				message: 'Sorry, something went wrong. Please try again.'
			})
		});
});

// catch 404 and forward to global error handler
app.use((req, res, next) => {
	var err = new Error('File not found');
	err.status = 404;
	next(err);
});

//global error handler
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({
		error: err
	});
});

// start listening on specified port
const server = app.listen(app.get('port'), () => {
	console.log('Express server listening on port ' + server.address().port);
});