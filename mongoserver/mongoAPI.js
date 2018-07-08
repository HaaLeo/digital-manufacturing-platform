var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
var request = require("request");

var url = 'mongodb://localhost:27017';
var dbase;

MongoClient.connect(url, function(err, db) {   //here db is the client obj
    if (err) {
      throw err;
    } else {
    dbase = db.db("mydb"); //here
    dbase.createCollection("QualityReports", function(err, res) {
        if (err) throw err;
        console.log("QualityReports collection created!");
        //db.close();   //close method has also been moved to client obj
    });

    var port = process.env.PORT || 3004;
      app.listen(port, function () {
    });
  }
});

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));

app.post('/addData', function(req, res) {
    console.log('POST to /addData');
    var hashID = req.body.hashID;
    var temperature = req.body.temperature;
    var pressure = req.body.pressure;

    console.log("DATA: hashID (" + hashID + "), temperature (" + temperature + "), pressure (" + pressure + ")");

    insert = {
        'hashID': hashID,
        'temperature': temperature,
        'pressure': pressure
    }

    dbase.collection('QualityReports').insert(insert, function(err, doc) {
        if (err) {
            console.log("Error adding data: " + err);
            throw err;
        } else {
            res.send(doc)
            console.log('Added data + ' + doc);
        }
    });
});

app.get('/getData/:hashID', function(req, res) {
  console.log("Quality Report Data being requested for hash: " + req.params.hashID);
  var hashID = req.params.hashID;
  dbase.collection('QualityReports').find({"hashID":hashID}).toArray(function(err, result) {
    if (err) {
        console.log("Error retrieving data: " + err);
        throw err;
    } else {
      console.log("RESULT: " + result);
      //pipe items
      var completeString = "";
      result.forEach(function(value) {
        completeString += JSON.stringify(value);
        completeString += "|";
      });
      res.send(completeString);
    }
  });
});
