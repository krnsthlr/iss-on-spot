'use strict';

const express = require('express');
const stat = require('./stat.js');
const app = express();

// set port
app.set('port', process.env.PORT || 5000);

app.use('/', (req, res, next) => {

	Promise.all([stat.getNumber('day'), stat.getNumber('week'), stat.getNumber('month')])
		.then((count) => res.send(count))
		.catch((err) => {return next(err)});

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