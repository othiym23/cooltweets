/*
** GET home page.
*/

exports.index = function(req, tweets, res){
  console.log(req);
  res.render('index', { title: 'Cool tweets', tweets: tweets, error: req});
};
