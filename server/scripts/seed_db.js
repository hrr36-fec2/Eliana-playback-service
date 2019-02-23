var mysql = require('mysql');
const axios = require('axios');
var SQL = require('sql-template-strings');


var seed = function (dbConnection) {
  var recordsInserted = 0;
  axios
    //fetch some track metadata from fma.org. the src urls do not download and play, so we'll be replacing those with real songs
    .get('https://freemusicarchive.org/featured.json')
    .then(results => {
      //These are 20 real songs stored on S3 with signed urls. We'll be looping through these and assigning a src to each of our 300 playlist entries in the db
      var songs = [
        'https://www.dropbox.com/s/3ej81lnj99yqmt8/02_-_Favorite_Secrets.mp3?dl=1',
        'https://www.dropbox.com/s/zsra7698ew2c3td/Black_Ant_-_01_-_Fater_Lee.mp3?dl=1',
        'https://www.dropbox.com/s/q8mi5mzjje5u476/BoxCat_Games_-_05_-_Battle_Boss.mp3?dl=1',
        'https://www.dropbox.com/s/7o4altcbkmh6kvh/BoxCat_Games_-_10_-_Epic_Song.mp3?dl=1',
        'https://www.dropbox.com/s/175i2ospy08vodr/Broke_For_Free_-_01_-_As_Colorful_As_Ever.mp3?dl=1',
        'https://www.dropbox.com/s/61d6t7vk0fj5825/Broke_For_Free_-_01_-_Night_Owl.mp3?dl=1',
        'https://www.dropbox.com/s/lh1lrj4yv1mthic/Broke_For_Free_-_05_-_Something_Elated.mp3?dl=1',
        'https://www.dropbox.com/s/lv5qdw9zso7zb2e/Dan_Lerch_-_09_-_O_Tannenbaum.mp3?dl=1',
        'https://www.dropbox.com/s/ik079turtset9tz/Gillicuddy_-_05_-_Springish.mp3?dl=1',
        'https://www.dropbox.com/s/yivhh7taxnsgmgl/Hogan_Grip_-_03_-_Stance_Gives_You_Balance.mp3?dl=1',
        'https://www.dropbox.com/s/urcsdx7e3ith00b/Jahzzar_-_01_-_The_last_ones.mp3?dl=1',
        'https://www.dropbox.com/s/2fyz4s1p67kmkee/Jahzzar_-_05_-_Siesta.mp3?dl=1',
        'https://www.dropbox.com/s/icnohez0lsxn3vg/Jason_Shaw_-_RUNNING_WATERS.mp3?dl=1',
        'https://www.dropbox.com/s/ktdk3hgd584juik/Kai_Engel_-_04_-_Moonlight_Reprise.mp3?dl=1',
        'https://www.dropbox.com/s/yalcoi0elbm5neu/Kevin_MacLeod_-_Ghost_Dance.mp3?dl=1',
        'https://www.dropbox.com/s/w9ku4aspbq31bkb/Monk_Turner__Fascinoma_-_01_-_Its_Your_Birthday.mp3?dl=1',
        'https://www.dropbox.com/s/ie9atoty25eiark/Podington_Bear_-_Starling.mp3?dl=1',
        'https://www.dropbox.com/s/0nxvkw3hr28c28a/Rolemusic_-_02_-_May.mp3?dl=1',
        'https://www.dropbox.com/s/i7ku2qo3gapos26/The_Freak_Fandango_Orchestra_-_01_-_Requiem_for_a_Fish.mp3?dl=1',
        'https://www.dropbox.com/s/o6gwna5at2fhh5g/The_Kyoto_Connection_-_09_-_Hachiko_The_Faithtful_Dog.mp3?dl=1',
        'https://www.dropbox.com/s/p9bpbisxmbk38go/Tours_-_01_-_Enthusiast.mp3?dl=1'
      ];
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

        var trackFileUrl = songs[i % songs.length];

        dbConnection.query(
          SQL`INSERT INTO playlist (track_id, track_title, artist_name, album_title, track_duration, album_image_file, track_file_url) VALUES (
            ${track.track_id}, ${track.track_title}, ${track.artist_name}, 
            ${track.album_title}, ${totalSeconds}, ${albumArtUrl}, ${trackFileUrl})`,
          function (err) {
            if (err) {
              console.log(err, 'ERROR IN SEED SCRIPT FOR LOOP!');
            } else {
              recordsInserted++;
              console.log(recordsInserted + ' records inserted');
            }
          }
        );
      }
      dbConnection.end();
    })
    .catch(error => {
      console.log(error, 'Error seeding db!');
    });
};

//call the function if module is being run from the command line
if (require.main === module) {
  dbConnection = mysql.createConnection({
    user: 'root',
    database: 'playlist'
    // debug: true
  });

  dbConnection.connect(function (err) {
    if (err) {
      console.log(err);
    }
  });
  seed(dbConnection);
}
