var mysql = require('mysql');
const axios = require('axios');
var SQL = require('sql-template-strings');


var seed = function (dbConnection) {
  var recordsInserted = 0;
  axios
    .get('https://freemusicarchive.org/featured.json')
    .then(results => {
      var songs = [
        'https://scootify-playlist-songs.s3.amazonaws.com/02_-_Favorite_Secrets.mp3?AWSAccessKeyId=AKIAJTJTJBX4OUBO5B5Q&Signature=c1ivjifRGw5pHCD%2F71aLO%2FPPn68%3D&Expires=1582251048',
        'https://scootify-playlist-songs.s3.amazonaws.com/Black_Ant_-_01_-_Fater_Lee.mp3?AWSAccessKeyId=AKIAJTJTJBX4OUBO5B5Q&Signature=I0OOUIMTrgM0IOAurfDbrj%2Ftt%2Bk%3D&Expires=1582251049',
        'https://scootify-playlist-songs.s3.amazonaws.com/BoxCat_Games_-_05_-_Battle_Boss.mp3?AWSAccessKeyId=AKIAJTJTJBX4OUBO5B5Q&Signature=e1zB9ELeTUUB1d57N3StSnU%2B3SE%3D&Expires=1582251049',
        'https://scootify-playlist-songs.s3.amazonaws.com/BoxCat_Games_-_10_-_Epic_Song.mp3?AWSAccessKeyId=AKIAJTJTJBX4OUBO5B5Q&Signature=zyOmOAGtEDeLzsSVWH0kvHk2cJM%3D&Expires=1582251050',
        'https://scootify-playlist-songs.s3.amazonaws.com/Broke_For_Free_-_01_-_As_Colorful_As_Ever.mp3?AWSAccessKeyId=AKIAJTJTJBX4OUBO5B5Q&Signature=8Y1UoA3LvEUaJStUh7c5%2FgIHQhY%3D&Expires=1582251051',
        'https://scootify-playlist-songs.s3.amazonaws.com/Broke_For_Free_-_01_-_Night_Owl.mp3?AWSAccessKeyId=AKIAJTJTJBX4OUBO5B5Q&Signature=AeriAyKr%2Fgic3ebCv8Xp2Ep0bls%3D&Expires=1582251051',
        'https://scootify-playlist-songs.s3.amazonaws.com/Broke_For_Free_-_05_-_Something_Elated.mp3?AWSAccessKeyId=AKIAJTJTJBX4OUBO5B5Q&Signature=o6GT8xszmzyS5zhekfc4dGFK5v4%3D&Expires=1582251052',
        'https://scootify-playlist-songs.s3.amazonaws.com/Dan_Lerch_-_09_-_O_Tannenbaum.mp3?AWSAccessKeyId=AKIAJTJTJBX4OUBO5B5Q&Signature=YCD3XV0eDFuQlewGM2hDdsHct48%3D&Expires=1582251052',
        'https://scootify-playlist-songs.s3.amazonaws.com/Gillicuddy_-_05_-_Springish.mp3?AWSAccessKeyId=AKIAJTJTJBX4OUBO5B5Q&Signature=QupGvSpu4OQdin0FlNAhrQN%2Bjss%3D&Expires=1582251053',
        'https://scootify-playlist-songs.s3.amazonaws.com/Hogan_Grip_-_03_-_Stance_Gives_You_Balance.mp3?AWSAccessKeyId=AKIAJTJTJBX4OUBO5B5Q&Signature=qizdzSuvTzWc%2Bis92GvJCQDg1qM%3D&Expires=1582251053',
        'https://scootify-playlist-songs.s3.amazonaws.com/Jahzzar_-_01_-_The_last_ones.mp3?AWSAccessKeyId=AKIAJTJTJBX4OUBO5B5Q&Signature=5Lh6%2BKpd1apNTuDNqmjkPLgrhpc%3D&Expires=1582251054',
        'https://scootify-playlist-songs.s3.amazonaws.com/Jahzzar_-_05_-_Siesta.mp3?AWSAccessKeyId=AKIAJTJTJBX4OUBO5B5Q&Signature=ZcVj%2FkNs2BulwTogQps8o3RhjBk%3D&Expires=1582251055',
        'https://scootify-playlist-songs.s3.amazonaws.com/Jason_Shaw_-_RUNNING_WATERS.mp3?AWSAccessKeyId=AKIAJTJTJBX4OUBO5B5Q&Signature=Z19d9wywpoB5ivfVS%2BOWOUbBTWc%3D&Expires=1582251055',
        'https://scootify-playlist-songs.s3.amazonaws.com/Kai_Engel_-_04_-_Moonlight_Reprise.mp3?AWSAccessKeyId=AKIAJTJTJBX4OUBO5B5Q&Signature=pPToAbdcZfUgwGS0UiXb4fL1iBo%3D&Expires=1582251056',
        'https://scootify-playlist-songs.s3.amazonaws.com/Kevin_MacLeod_-_Ghost_Dance.mp3?AWSAccessKeyId=AKIAJTJTJBX4OUBO5B5Q&Signature=fcPQg14%2BOK9S3Z1QzS%2BN%2FnI8f30%3D&Expires=1582251057',
        'https://scootify-playlist-songs.s3.amazonaws.com/Monk_Turner__Fascinoma_-_01_-_Its_Your_Birthday.mp3?AWSAccessKeyId=AKIAJTJTJBX4OUBO5B5Q&Signature=nOEhzLk6SxxDstqlHDXmSQ5h8UM%3D&Expires=1582251057',
        'https://scootify-playlist-songs.s3.amazonaws.com/Podington_Bear_-_Starling.mp3?AWSAccessKeyId=AKIAJTJTJBX4OUBO5B5Q&Signature=ZrqwkBDSJAjTGJs0jvwJoEagK%2BY%3D&Expires=1582251058',
        'https://scootify-playlist-songs.s3.amazonaws.com/The_Freak_Fandango_Orchestra_-_01_-_Requiem_for_a_Fish.mp3?AWSAccessKeyId=AKIAJTJTJBX4OUBO5B5Q&Signature=J9I%2BK%2FeWr69A8fLQc%2BEd35ZWMvc%3D&Expires=1582251058',
        'https://scootify-playlist-songs.s3.amazonaws.com/The_Kyoto_Connection_-_09_-_Hachiko_The_Faithtful_Dog.mp3?AWSAccessKeyId=AKIAJTJTJBX4OUBO5B5Q&Signature=VqE%2FH4YBsD%2BauCCrDcBV0QJtz0g%3D&Expires=1582251059',
        'https://scootify-playlist-songs.s3.amazonaws.com/Tours_-_01_-_Enthusiast.mp3?AWSAccessKeyId=AKIAJTJTJBX4OUBO5B5Q&Signature=5oPp71t6yGvgTqUc3gw7R6MEY7k%3D&Expires=1582251059'
      ];
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
