var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
var request = require("request");

var url = 'mongodb://localhost:27017';
var db;

MongoClient.connect(url, function(err, db) {   //here db is the client obj
    if (err) {
      throw err;
    } else {
    var dbase = db.db("mydb"); //here
    dbase.createCollection("QualityReports", function(err, res) {
        if (err) throw err;
        console.log("QualityReports collection created!");
        db.close();   //close method has also been moved to client obj
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

    insert = {
        'hashID': hashID,
        'temperature': temperature,
        'pressure': pressure
    }

    db.collection('QualityReports').insert(insert, function(err, doc) {
        if (err) {
            console.log("Error adding data: " + err);
            throw err;
        } else {
            res.send()
            console.log('Added data');
        }
    });

});
