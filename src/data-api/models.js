'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetItemSchema  = new Schema({
	date: {
		type: Date, 
		default: Date.now
	},
	location: String
});

const TweetItem = mongoose.model('TweetItem', TweetItemSchema);

module.exports.TweetItem = TweetItem;