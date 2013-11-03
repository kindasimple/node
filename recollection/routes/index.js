
/*
 * GET home page.
 */

exports.index = function(req, res){
  if(req.session.savedMnemonics == null || req.session.savedMnemonics == undefined)
  {
    console.log('saved mnemonics are undefined');
    req.session.savedMnemonics = [];
  }
  console.log(req.session.savedMnemonics);
  console.log("Saved Image: " + req.session.savedImagePath);
  
    // Retrieve
  var MongoClient = require('mongodb').MongoClient;

  // Connect to the db
  MongoClient.connect("mongodb://localhost:27017/recollection", function(err, db) {
  if(err) { return console.dir(err); }
  
  var collection = db.collection('mnemonics');
    var result = collection.find({}, {mnemonics:1, pictogram:1, title:1, _id:1}).toArray(function (err, docs) {
        console.log(docs);
        res.render('index', { title: 'Recollection', Inventory:docs, savedMnemonics : req.session.savedMnemonics, savedImagePath:req.session.savedImagePath});
    });
  })

  
};

exports.numbers = function(req, res){
  console.log("redirecting to " + req.body.numbers);
    res.redirect('/results/' + req.body.numbers);
};

exports.results = function(req, res){
  var pageContent = {title: req.param('query')};
  pageContent.savedMnemonics = req.session.savedMnemonics;

  // Retrieve
  var MongoClient = require('mongodb').MongoClient;

  // Connect to the db
  MongoClient.connect("mongodb://localhost:27017/recollection", function(err, db) {
  if(err) { return console.dir(err); }
  
  var collection = db.collection('dictionary');
  console.log(req.param('query'));
    var result = collection.find({numbers:pageContent.title}, {encoding:1, phoneme:1}).toArray(function (err, docs) {
        //console.log(docs);
        pageContent.results = docs;
        pageContent.savedMnemonics = req.session.savedMnemonics;
        res.render('results', pageContent);
    });
  })
};

exports.apiNumbers = function(req, res){
  // Retrieve
  var MongoClient = require('mongodb').MongoClient;

  // Connect to the db
  MongoClient.connect("mongodb://localhost:27017/recollection", function(err, db) {
  if(err) { return console.dir(err); }
  
  var collection = db.collection('dictionary');
  console.log(req.param('numbers'));
    var result = collection.find({numbers:req.param('numbers')}, {encoding:1, numbers:1, _id:1}).toArray(function (err, docs) {
        //console.log(docs);
        // Setting the appropriate Content-Type
            res.set('Content-Type', 'text/json');

            // Sending the feed as a response
            res.send(docs);
    });
})
   
};

exports.apiEntry = function(req, res){
  // Retrieve
  var MongoClient = require('mongodb').MongoClient;

  // Connect to the db
  MongoClient.connect("mongodb://localhost:27017/recollection", function(err, db) {
  if(err) { return console.dir(err); }
  
  var collection = db.collection('dictionary');
  console.log(req.param('id'));
  var id = new require('mongodb').ObjectID(req.param('id'));
    var result = collection.findOne({ _id : id}, function (err, doc) {
        if (doc){
            console.log(doc._id);
            res.set('Content-Type', 'text/json');

            // Sending the feed as a response
            res.send(doc);
        } else {
            console.log('no data for this id');
        }
    });
})
};

exports.uploads = function(req, res){
  var fs = require('fs');
  fs.readFile(req.files.displayImage.path, function (err, data) {
    var newFile = new Date().getTime() + "." + req.files.displayImage.name.split('.').pop();
    var newPath = __dirname + "/../public/uploads/" + newFile;
    console.log("upload file path: " + newPath);
    fs.writeFile(newPath, data, function (err) {
      req.session.savedImagePath = "uploads/" + newFile;
      res.redirect("back");
    });
  });
}

exports.saveMnemonic = function(req, res){
  var pageContent = {title: req.param('query')};
  console.log("redirecting to " + req.body.numbers);
  console.log("id " + req.body.mnemonic_id);
  if(req.session.savedMnemonics != null && req.session.savedMnemonics !== undefined)
  {
  console.log("adding to saved mnemonics");
    req.session.savedMnemonics.push({numbers:req.body.numbers,mnemonic:req.body.mnemonic, phoneme:req.body.phoneme, phonemeList:req.body.phoneme.replace(/[0-9]/g, "").split(" ")});
  }
  else
  {
    console.log("initializing saved mnemonics");
    req.session.savedMnemonics = [{numbers:req.body.numbers,mnemonic:req.body.mnemonic, phoneme:req.body.phoneme, phonemeList:req.body.phoneme.replace(/[0-9]/g, "").split(" ")}];
  }
  console.log('mnemonics array:' + req.session.savedMnemonics);
  console.log(req.session.savedMnemonics);
  res.redirect('/results/' + req.body.numbers);
};

exports.save = function(req, res){

  // Retrieve
  var MongoClient = require('mongodb').MongoClient;

  // Connect to the db
  MongoClient.connect("mongodb://localhost:27017/recollection", function(err, db) {
      if(err) { return console.dir(err); }
      
      var collection = db.collection('mnemonics');
      console.log("saving mnemonics");
      console.log(req.session.savedMnemonics);
      collection.save({mnemonics:req.session.savedMnemonics, title:req.body.title, pictogram:req.session.savedImagePath}, function(err, data){
        if(data)
        {
          console.log(data);
          req.session.savedImagePath = null;
          req.session.savedMnemonics = [];
        }
        else
        {
          console.log("Failed to save data");
        }
        res.redirect("back");
      });
  });
}
