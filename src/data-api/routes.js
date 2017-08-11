'use strict';

const express = require('express');
const router = express.Router();
const TweetItem = require('./models.js').TweetItem;

// GET tweet items
router.get('/tweets', (req, res, next) => {

	let query;
	// get number of tweets in the last 24h
	if(req.query.filter === 'day'){
		query = TweetItem.count({
			date: {
				$gte: (new Date(new Date()).getTime()-(24*60*60*1000))
			}
		});
	};
	// get number of tweets in the last 7d
	if(req.query.filter === 'week'){
		query = TweetItem.count({
			date: {
				$gte: (new Date(new Date()).getTime()-(7*24*60*60*1000))
			}
		});
	};
	// get number of tweets in the last 30d
	if(req.query.filter === 'month'){
		query = TweetItem.count({
			date: {
				$gte: (new Date(new Date()).getTime()-(30*60*60*1000))
			}
		});
	};

	query.exec((err, count) => {
		if(err) return next(err);
		return res.json(count);
	});

});

// POST new tweet item
router.post('/tweets', (req, res, next) => {

	const tweet = new TweetItem({
		location: req.body.location
	});
	
	tweet.save((err) => {
		if(err) {
			err.status = 400;
			return next(err);
		}
		res.status(201);
		res.setHeader('Location', '/');
		res.send();
	})

});

module.exports = router;