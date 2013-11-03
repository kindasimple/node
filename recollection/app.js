
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.post('/', routes.numbers);
app.post('/results/:query/:mnemonic_id', routes.saveMnemonic);

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/results', routes.index);
app.get('/results/:query', routes.results);
app.post('/uploads', routes.uploads);
app.post('/save', routes.save);

app.get('/api/1/mnemonics/:numbers.json', routes.apiNumbers);
app.get('/api/1/entry/:id.json', routes.apiEntry);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  
  //populateDatabase();
});

function populateDatabase()
{
  var fs = require('fs');
  fs.readFile( __dirname + '/data/dictionary-min.json', function (err, data) {
      if (err) {
        throw err; 
      }
      data = JSON.parse(data);
      // Retrieve
      var MongoClient = require('mongodb').MongoClient;

      // Connect to the db
      MongoClient.connect("mongodb://localhost:27017/recollection", function(err, db) {
      if(err) { return console.dir(err); }
      
      var collection = db.collection('dictionary');
      for(var i=0;i<data.length;i++)
      {
        collection.insert({numbers:data[i].Encoding, encoding:data[i].Text, phoneme:data[i].Phoneme}, function(err, doc){ 
            if(err)
            {
                console.log("Error inserting record into database");
            }
            else
            {}
        });
      }  
      //console.log(data.toString());
    });
  });
}
