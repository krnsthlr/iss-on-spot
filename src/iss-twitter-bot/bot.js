'use strict';

const Twit = require('twit');
const find = require('./find.js');
const stat = require('../data-api/index.js');

//load environment variables
require('dotenv').config();

// Set up a public stream on the Twitter Streaming API,
// track any mentions of '@ISSOnSpot'
const Twitter = new Twit({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const stream = Twitter.stream('statuses/filter', {track: ['@ISSOnSpot']});

// When a new status (tweet) comes into the stream,
// trigger the callback
stream.on('tweet', reply);

// On 'tweet' event
function reply(tweet) {
	// Get tweet location and author's screen name
	const location = tweet.place.full_name;
	const name = tweet.user.screen_name;

	// external API requests
	find.coordinates(location)
		.then((coordinates) => {return find.passTimes(coordinates)})
		.then((data) => {return find.localTime(data)})
		.then((result) => {
			tweetBack('Hi, @' + name + ', the ISS will be over ' + location
				+ ' on ' + result.time + ' for ' + result.duration + ' sec.', tweet.id);
		})
		.catch((err) => {
			console.error(err);
			tweetBack('Hi, @' + name + 
			', sorry, something went wrong. Please make sure you added a location to your tweet.',
			 tweet.id);
		});

		//store time and location of tweet in db
		stat.write(location);
};

// POST reply to the user
function tweetBack(statusText, replyID){

	let tweet = {
		'status': statusText,
		'in_reply_to_status_id': replyID
	}

	Twitter.post('statuses/update', tweet, function(err, data, response){
		if(err) console.error(err);
		else console.log('success!');
	});
};
