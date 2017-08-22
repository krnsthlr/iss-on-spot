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
app.use(express.static('public'));
// set up view engine
app.set('view engine', 'pug');
app.set('views', './public/views')

app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('dev'));

// On initial page request, get location
// request stats and render index view
app.get('/', (req, res, next) => {

	Promise.all([
			TweetItem.getNumber('day'), 
			TweetItem.getNumber('week'), 
			TweetItem.getNumber('month')
		])
		.then((data) => {
			res.render('index', {hrs: data[0], week: data[1], month: data[2]});
		})
		.catch((err) => {
			res.render('index', {hrs: NaN, week: NaN, month: NaN})
		});
});

// write new request item to db
app.post('/', (req, res, next) => {

	let item = new TweetItem({location: req.body.location});
	item.save((err) => {
		if(err) console.error(err);
	});

	next();
});

// aggregate response and send back json data
app.post('/', (req, res) => {

	Promise.all([
			find.flyOver(req.body.location),
			TweetItem.getNumber('day'),
			TweetItem.getNumber('week'),
			TweetItem.getNumber('month')
		]).then((result) => {
			res.json({
				requests24hrs: result[1],
				requestsWeek: result[2],
				requestsMonth: result[3],
				message: 'The ISS will be over ' + req.body.location 
				+ ' on ' + result[0].time + ' (local time) ' 
				+ 'for ' + result[0].duration + ' sec.'
			})
		}).catch((err) => {
			console.error(err);
			res.json({
				requests24hrs: NaN,
				requestsWeek: NaN,
				requestsMonth: NaN,
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