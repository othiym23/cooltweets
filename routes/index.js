
/*
 * GET home page.
 */

exports.index = function(req, tweets, res){
  // get last 100 tweets from the db
  console.log(tweets);
  res.render('index', { title: 'Cool tweets', tweets: tweets});
};
