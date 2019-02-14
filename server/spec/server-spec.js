var mysql = require('mysql');
var seed = require('../scripts/seed_db.js');
const axios = require('axios');

describe('Persistent Node Playlist Server', () => {
  dbConnection = mysql.createConnection({
    user: 'root',
    database: 'playlist'
  });

  dbConnection.connect(function(err) {
    console.log(err);
  });
  let tablename = 'playlist';
  dbConnection.query('truncate ' + tablename);
  seed.seed();

  it('Should output the id of the first track in the playlist as 1', () => {
    axios.get('http://127.0.0.1:3001/playlist').then(results => {
      let playlistLog = JSON.parse(results);
      expects(playlistLog[0].id).to.equal(1);
    });
  });

  it('Should output a playlist of 30 tracks from the DB', () => {
    axios.get('http://127.0.0.1:3001/playlist').then(results => {
      let playlistLog = JSON.parse(results);
      expect(playlistLog.length).to.equal(30);
    });
  });

  it('Should retrieve a track based on a trackid', () => {
    axios.get('http://127.0.0.1:3001/playlist/track/89433').then(results => {
      let playlistLog = JSON.parse(body);
      expect(playlistLog[0].track_id).to.equal(89433);
    });
  });

  dbConnection.query('truncate ' + tablename);
  dbConnection.end();
});
