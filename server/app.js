var express = require('express');
var cors = require('cors');
var db = require('./db');
var path = require('path');
var models = require('./models');

// Middleware
var morgan = require('morgan');
var parser = require('body-parser');

var app = express();
module.exports.app = app;

// Set what we are listening on.
app.set('port', 3001);

// Logging and parsing
app.use(morgan('dev'));
app.use(parser.json());

//Enable CORS
app.use(cors());

// Serve the client files
app.use(express.static(__dirname + '/../public'));

// If we are being run directly, run the server.
if (!module.parent) {
  app.listen(app.get('port'));
  console.log('Listening on', app.get('port'));
}

// Routes

//get playlist
app.get('/playlist', function (req, res) {
  console.log(req.body, 'GET PLAYLIST REQUEST RECEIVED BY SERVER!');
  models.getPlaylist30((error, results) => {
    if (error) {
      console.log(error, 'SERVER ERROR FETCHING PLAYLIST!');
      res.status(500).send(error);
    } else {
      console.log(results, 'SERVER SUCCESS FETCHING PLAYLIST!!');
      res.status(200).json(results);
    }
  });
});

//get a specific track
app.get('/playlist/track/:trackid', function (req, res) {
  console.log(req.body, 'GET TRACK REQUEST RECEIVED BY SERVER!');
  let trackid = req.params.trackid;
  console.log(trackid);
  models.getTrack(trackid, (error, results) => {
    if (error) {
      console.log(error, 'SERVER ERROR FETCHING TRACK!');
      res.status(500).send(error);
    } else {
      console.log(results, 'SERVER SUCCESS FETCHING TRACK!!');
      res.status(200).json(results);
    }
  });
});

//toggle favorites status on a specific track
app.patch('/playlist/track/:trackid', function (req, res) {
  console.log('PATCH REQUEST RECEIVED BY SERVER!');
  //find track by trackId
  let trackid = req.params.trackid;
  console.log(trackid);
  models.toggleFavorite(trackid, (error, result) => {
    if (error) {
      console.log(error, 'ERROR IN SERVER, PATCH REQUEST!!');
      res.status(500).send(error);
    } else {
      console.log(result, 'SUCCESS IN SERVER, PATCH REQUEST!!!');
      res.status(200).json(result);
    }
  });
});
