
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.numbers = function(req, res){
  console.log("redirecting to " + req.body.numbers);
    res.redirect('/results/' + req.body.numbers);
};

exports.results = function(req, res){
//res.render('results', { title: 'Express' });

  // Retrieve
  var MongoClient = require('mongodb').MongoClient;

  // Connect to the db
  MongoClient.connect("mongodb://localhost:27017/recollection", function(err, db) {
  if(err) { return console.dir(err); }
  
  var collection = db.collection('dictionary');
  console.log(req.param('query'));
    var result = collection.find({numbers:req.param('query')}, {encoding:1}).toArray(function (err, docs) {
        var pageContent = {title: req.param('query')};
        console.log(docs);
        pageContent.results = docs;
        res.render('results', pageContent);
    });
})
};