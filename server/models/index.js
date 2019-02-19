var db = require('../db');

// selects the first 30 tracks from db
let getPlaylist30 = function (callback) {
  db.dbConnection.query(
    'SELECT * FROM playlist ORDER BY id ASC LIMIT 30',
    (err, data) => {
      if (err) {
        console.log(err, 'ERROR WITH MYSQL SELECT QUERY!');
        callback(err, null);
      } else {
        console.log(data, 'this is the playlist data!');
        callback(null, data);
      }
    }
  );
};

//selects a specific track from db based on track_id
let getTrack = function (trackid, callback) {
  db.dbConnection.query(
    'SELECT * FROM playlist WHERE track_id = ? LIMIT 1 ',
    [trackid],
    (err, data) => {
      if (err) {
        console.log(err, 'ERROR WITH MYSQL SELECT QUERY!');
        callback(err, null);
      } else {
        console.log(data, 'this is the playlist data!');
        callback(null, data);
      }
    }
  );
};

//a function which toggles a song as favorited or unfavorited
let toggleFavorite = function (trackid, callback) {
  db.dbConnection.query(
    'UPDATE playlist SET favorite = (favorite + 1) % 2 WHERE track_id = ?',
    [trackid],
    (err, data) => {
      if (err) {
        console.log(err, 'ERROR WITH MYSQL UPDATE QUERY!!');
        callback(err, null);
      } else {
        console.log(data, 'toggled favorites!');
        callback(null, data);
      }
    }
  );
};

module.exports = {
  getTrack,
  getPlaylist30,
  toggleFavorite
};
