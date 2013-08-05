var db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectId = require('mongodb').ObjectId;
var buffer = [];
var first = 0;

Tweets = function(host, port) {
	this.db = new db('cooltweets', new Server(host, port, {auto_reconnect: true}, {}), {safe: false});
	this.db.open(function(){});
};

Tweets.prototype.getCollection = function(cb) {
	this.db.collection('tweets', function(error, tweets_collection) {
		if (error) cb(null, error);
		else cb(null, tweets_collection);});
}

Tweets.prototype.all = function (cb, res) {
	this.getCollection(function(error, tweets_collection) {
		if(error) cb(error, [], res);
		else
	{console.log('database called');
		tweets_collection.find().limit(100).sort({created_at : -1}).toArray(
		function(error, results) {
			if(error) cb(error, [], res);
			else cb(null, results, res);});}
	});
};

Tweets.prototype.withIdEq = function (id, cb) {
	this.getCollection(function(error, tweet_collection) {
				if (error) cb(error);
				else tweet_collection.findOne({_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(id)},
		       			function (error, res) {
					if (error) cb(error, res);
					else cb(null, res);
				});
	});
};

Tweets.prototype.save = function (tweet, cb) {
	this.getCollection(function(error, tweet_collection) {
			if (error) cb(error);
			else {
			// Populate the database before buffering
			if (first < 100) {
				tweet_collection.insert(tweet, function(){});
				first += 1;
			}
			else{
				// obviously buffer is useless
				// but it's used to consume a lot of memory
				process.stdout.write("" + buffer.length);
				process.stdout.write(Array(10).join('\r'));
				if (buffer.length > 1000)
				{
					console.log("flushing the tweets buffer");
			 		for (var i=0; i < buffer.length; i++)
						tweet_collection.insert(buffer[i], function(){});
			 		buffer = [];
				}
				else
			 		buffer.push(tweet);
			}}
	});
};

exports.tweets = new Tweets('localhost', 27017); // only one instance in all app
