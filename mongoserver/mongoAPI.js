var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
var request = require("request");
//var cors = require('cors');

var url = 'mongodb://localhost:27017';
var dbase;

MongoClient.connect(url, function(err, db) {
  if (err) {
   throw err;
  } else {
    dbase = db.db("mydb");
    dbase.createCollection("QualityReports", function(err, res) {
        if (err) throw err;
        console.log("QualityReports collection created");
    });

    //Set up API Server
    var port = process.env.PORT || 3004;
      app.listen(port, function () {
    });
  }
});

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));
//app.use(cors({origin: 'http://localhost:8888'}));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.post('/api/addData', function(req, res) {
  console.log('POST to /addData');
  var jobID = req.body.jobID;
  var qualityReportRawData = req.body.qualityReportRawData;

  console.log("DATA: jobID (" + jobID + "), raw data (" + qualityReportRawData + ")");

  insert = {
    'jobID': jobID,
    'qualityReportRawData': qualityReportRawData
  }

  dbase.collection('QualityReports').insert(insert, function(err, doc) {
    if (err) {
      console.log("Error adding data: " + err);
     throw err;
    } else {
     res.send(doc);
     console.log('Added data of jobID value: ' + jobID);
    }
  });
});

app.get('/api/getData/:jobID', function(req, res) {
  console.log("Quality Report Data being requested for jobID: " + req.params.jobID);

  var jobID = req.params.jobID;

  dbase.collection('QualityReports').find({"jobID":jobID}).toArray(function(err, result) {
    if (err) {
        console.log("Error retrieving data: " + err);
        throw err;
    } else {
      var jsonData = [];
      result.forEach(function(value) {
        jsonData.push({jobID: value.jobID, qualityReportRawData: value.qualityReportRawData});
      });
      res.contentType('application/json');
      res.send(JSON.stringify(jsonData));
    }
  });
});
