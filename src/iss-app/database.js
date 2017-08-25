'use strict';

const mongoose = require('mongoose');
const TweetItem = require('./models.js').TweetItem;

// mpromise (mongoose's default promise library) is 
// deprecated (http://mongoosejs.com/docs/promises.html), 
// plug in ES6 native promises instead.
mongoose.Promise = global.Promise;

//set up database connection
const db = mongoose.connect(process.env.MONGODB_URI || 
	'mongodb://localhost:27017/user-tweets', {
	useMongoClient: true,
});

db
	.then((db) => {
		console.log('mongoDB has been connected');
	})
	.catch((err) => {
		console.error('Connection error: ', err);
	});
