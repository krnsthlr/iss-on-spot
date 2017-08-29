'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const TweetItem = require('./models.js').TweetItem;
const find = require('../iss-twitter-bot/find.js');

const app = express();

// set port
app.set('port', process.env.PORT || 5000);
// start serving static files
app.use(express.static('public/'));
// set up view engine
app.set('view engine', 'pug');
app.set('views', './public/views')

app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('dev'));

// On initial page request, load index file
app.get('/', (req, res, next) => {
	res.render('index');
});

// GET location request stats
app.get('/stat', (req, res, next) => {

	Promise.all([
			TweetItem.getNumber('day'), 
			TweetItem.getNumber('week'), 
			TweetItem.getNumber('month')
		])
		.then((data) => {
			res.json({
				requests24hrs: data[0],
				requestsWeek: data[1],
				requestsMonth: data[2]
			})
		})
		.catch((err) => {
			res.json({
				requests24hrs: NaN,
				requestsWeek: NaN,
				requestsMonth: NaN
			})
		});
});

// write new request item to db
app.post('/', (req, res, next) => {

	let item = new TweetItem({location: req.body.location});
	item.save((err) => {
		if(err) console.error(err);
		next();
	});
});

// aggregate response and send back json
app.post('/', (req, res) => {

	find.flyOver(req.body.location)
		.then((result) => {
			res.json({
				message: 'The ISS will be over ' + req.body.location 
				+ ' on ' + result.time + ' (local time) ' 
				+ 'for ' + result.minutes + ' minutes and '
				+ result.seconds + ' seconds.'
			})
		}).catch((err) => {
			console.error(err);
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
	res.render('error', {err: err});
});

// start listening on specified port
const server = app.listen(app.get('port'), () => {
	console.log('Express server listening on port ' + server.address().port);
});