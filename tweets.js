Tweets = function(){};
Tweets.prototype.dummy = [];

Tweets.prototype.all = function (cb, res) {
	// get only 100 of them
	cb(null, this.dummy, res);
};

Tweets.prototype.withIdEq = function (id, cb) {
	var result = null;
	for (var i = this.dummy.length - 1; i >= 0; i--) {
		if (this.dummy[i]._id == id) {
			result = this.dummy[i];
			break;
		}
	}
	cb(null, result);
};

Tweets.prototype.save = function (tweet, cb) {
	this.dummy.unshift(tweet);
	if (cb)
		cb(null, tweet);
}

exports.tweets = new Tweets(); // only one instance in all app
