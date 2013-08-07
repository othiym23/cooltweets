var db = require('mongodb').Db;
var Server = require('mongodb').Server;
var buffer = [];
var first = 0;

function Tweets(host, port) {
  this.db = new db('cooltweets',
                   new Server(host, port, {auto_reconnect: true}, {}),
                   {safe: true});
}

Tweets.prototype.connect = function(cb) {
  this.db.open(cb);
};

Tweets.prototype.getCollection = function(cb) {
  this.db.collection('tweets', function(error, tweets_collection) {
    if (error) return cb(error);

    cb(null, tweets_collection);
  });
};

Tweets.prototype.all = function (cb, res) {
  this.getCollection(function(error, tweets_collection) {
    if(error) return cb(error);

    tweets_collection.find().limit(100).sort({created_at : -1}).toArray(
      function(error, results) {
        if (error) return cb(error);

        cb(null, results, res);
      }
    );
  });
};

Tweets.prototype.withIdEq = function (id, cb) {
  this.getCollection(function(error, tweet_collection) {
    if (error) return cb(error);

    tweet_collection.findOne(
      {_id: tweet_collection.db.bson_serializer.ObjectID.createFromHexString(id)},
      function (error, res) {
        if (error) return cb(error);

        cb(null, res);
      }
    );
  });
};

Tweets.prototype.save = function (tweet, cb) {
  this.getCollection(function(error, tweet_collection) {
    if (error) return cb(error);

    // Populate the database before buffering
    if (first < 100) {
      tweet_collection.insert(tweet, {w:1}, cb);
      first += 1;
    }
    else {
      // obviously buffer is useless
      // but it's used to consume a lot of memory
      process.stdout.write("\r     \r" + buffer.length);
      if (buffer.length >= 1000) {
        console.log("\nflushing the tweets buffer");
        tweet_collection.insert(buffer, {w:1}, cb);
        buffer = [];
      }
      else {
        buffer.push(tweet);
      }
    }
  });
};

exports.tweets = new Tweets('localhost', 27017); // only one instance in all app
