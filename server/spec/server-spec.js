var chai = require('chai');
var mysql = require('mysql');
const axios = require('axios');
const expect = chai.expect;

var dbConnection;
describe('Persistent Node Playlist Server', () => {
  before(function () {
    dbConnection = mysql.createConnection({
      user: 'root',
      database: 'playlist'
    });

    dbConnection.connect(function (err) {
      if (err) {
        console.log(err);
      }
    });

  });

  it('Should output the id of the first track in the playlist as 1', () => {
    axios.get('http://127.0.0.1:3001/playlist').then(response => {
      // console.log(response.data);
      let playlistLog = response.data;//JSON.parse(response.data);
      expect(playlistLog[0].id).to.equal(1);
    });
  });

  it('Should output a playlist of 30 tracks from the DB', () => {
    axios.get('http://127.0.0.1:3001/playlist').then(response => {
      let playlistLog = response.data;//JSON.parse(response.data);
      expect(playlistLog.length).to.equal(30);
    });
  });

  it('Should retrieve a track based on a trackid', () => {
    axios.get('http://127.0.0.1:3001/playlist/track/89433').then(response => {
      let playlistLog = response.data;//JSON.parse(response.data);
      expect(playlistLog[0].track_id).to.equal(89433);
    });
  });

  after(function () {
    dbConnection.end();
  });
});
