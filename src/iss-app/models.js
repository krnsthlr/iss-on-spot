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


TweetItemSchema.statics.getNumber = function(period){

	if(period === 'day') {
		return this.count({
			date: {
				$gte: (new Date(new Date()).getTime()-(24*60*60*1000))
			}
		}).exec();
	}

	if(period === 'week') {
		return this.count({
			date: {
				$gte: (new Date(new Date()).getTime()-(7*24*60*60*1000))
			}
		}).exec();
	}

	if(period === 'month'){
		return this.count({
			date: {
				$gte: (new Date(new Date()).getTime()-(30*24*60*60*1000))
			}
		}).exec();
	}
};

const TweetItem = mongoose.model('TweetItem', TweetItemSchema);

module.exports.TweetItem = TweetItem;