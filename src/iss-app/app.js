'use strict';

const express = require('express');
const morgan = require('morgan');
const stat = require('../tweet-data/index.js');
const app = express();

// set port
app.set('port', process.env.PORT || 5000);
// start serving static files
app.use(express.static('public'));
app.set('views', 'views');
app.set('view engine', 'pug');

app.use(morgan('dev'));

app.get('/', (req, res, next) => {

	res.render('index', {title: 'Hey, ', message: 'Hello there!'});

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