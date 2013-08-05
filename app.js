require('newrelic');

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

// Twitter streaming api
var twitter = require('ntwitter');
var credentials = require('./credentials.js');

var tweets = require('./tweets').tweets;

var app = express();

app.configure('development', function(){
	  app.use(express.errorHandler({ dumpExceptions: true, showStack: true  }));
});

app.configure('production', function(){
	  app.use(express.errorHandler()); 
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function (req, res) { tweets.all(routes.index, res); });
app.get('/error', function() {throw new Error('This is a test')});

var t = new twitter({
	consumer_key: credentials.consumer_key,
    	consumer_secret: credentials.consumer_secret,
    	access_token_key: credentials.access_token_key,
    	access_token_secret: credentials.access_token_secret
});

t.stream('statuses/filter',
	{ track: ['awesome', 'cool', 'rad', 'gnarly', 'groovy']},
	  function(stream) {
		stream.on('data', function(tweet) {
		tweets.save(tweet, null);
		});
	  });

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
