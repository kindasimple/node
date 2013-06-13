
/*
 * GET users listing.
 */
 


exports.list = function(req, res){
  //res.send("respond with a resource");
  
  // Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
  if(err) { return console.dir(err); }
  
  var collection = db.collection('test');
  var result = collection.findOne({page:"Users"}, function(err, item){    
    var pageContent = {title: 'Users'};
    pageContent.members = item.members;
    res.render('users', pageContent);
  });
  
});
};