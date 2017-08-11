'use strict';

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const jsonParser = require('body-parser').json();
const app = express();

const routes = require('./routes.js');

// set port
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use(jsonParser);

// mpromise (mongoose's default promise library) is 
// deprecated (http://mongoosejs.com/docs/promises.html), 
// plug in ES6 native promises instead.
mongoose.Promise = global.Promise;

//set up database connection
const db = mongoose.connect('mongodb://localhost:27017/user-tweets', {
	useMongoClient: true
});

db
	.then((db) => {
		console.log('mongoDB has been connected');
	})
	.catch((err) => {
		console.error('Connection error: ', err);
	});

app.use('/api', routes);

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