var mysql = require('mysql');
const axios = require('axios');
var SQL = require('sql-template-strings');

dbConnection = mysql.createConnection({
  user: 'root',
  database: 'playlist'
  // debug: true
});

dbConnection.connect(function(err) {
  console.log(err);
});

var seed = function() {
  axios
    .get('https://freemusicarchive.org/featured.json')
    .then(results => {
      // console.log(results.data.aTracks);
      var tracks = results.data.aTracks;
      for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        //changing track_duration value from string of hrs:min:sec to seconds
        var arr = track.track_duration.split(':');
        var totalSeconds = 0;
        totalSeconds = parseInt(arr[0], 10) * 3600;
        totalSeconds += parseInt(arr[1], 10) * 60;
        totalSeconds += parseInt(arr[2], 10) * 1;

        //changing album_image_file value to a url
        var albumArtUrl =
          'https://freemusicarchive.org/file/' + track.album_image_file;

        dbConnection.query(
          SQL`INSERT INTO playlist (track_id, track_title, artist_name, album_title, track_duration, album_image_file, track_file_url) VALUES (${
            track.track_id
          }, ${track.track_title}, ${track.artist_name}, ${
            track.album_title
          }, ${totalSeconds}, ${albumArtUrl}, ${track.track_file_url})`,
          function(err, result) {
            if (err) {
              callback(err);
            } else {
              console.log('1 record inserted');
              callback(result);
            }
          }
        );
      }
    })
    .catch(error => {
      console.log(error, 'Error seeding db!');
    });
};

//call the function if module is being run from the command line
if (require.main === module) {
  seed();
}

module.exports.seed = seed;

//to get album art thumbnail:
//"https://freemusicarchive.org/file" + "image file path"

//to get duration, convert to seconds
