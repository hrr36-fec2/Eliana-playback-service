var chai = require('chai');
var db = require('../db');
const axios = require('axios');
const expect = chai.expect;

describe('Persistent Node Playlist Server', () => {
  // before(function () {
  //   dbConnection = mysql.createConnection({
  //     user: 'root',
  //     database: 'playlist'
  //   });

  //   dbConnection.connect(function (err) {
  //     if (err) {
  //       console.log(err);
  //     }
  //   });

  // });

  it('Should output the id of the first track in the playlist as 1', (done) => {
    axios.get('http://127.0.0.1:3001/playlist').then(response => {
      // console.log(response.data);
      let playlistLog = response.data;
      expect(playlistLog[0].id).to.equal(1);
      done();
    }).catch((reason) => {
      done(reason);
    });
  });

  it('Should output a playlist of 30 tracks from the DB', (done) => {
    axios.get('http://127.0.0.1:3001/playlist').then(response => {
      let playlistLog = response.data;
      expect(playlistLog.length).to.equal(30);
      done();
    }).catch((reason) => {
      done(reason);
    });
  });

  it('Should retrieve a track based on a trackid', (done) => {
    axios.get('http://127.0.0.1:3001/playlist/track/89433').then(response => {
      let playlistLog = response.data;
      expect(playlistLog[0].track_id).to.equal(89433);
      done();
    }).catch((reason) => {
      done(reason);
    });
  });

  it('Should retrieve the correct track_file_url', (done) => {
    axios.get('http://127.0.0.1:3001/playlist/track/89433').then(response => {
      let playlistLog = response.data;
      expect(playlistLog[0].track_file_url).to.equal('https://www.dropbox.com/s/3ej81lnj99yqmt8/02_-_Favorite_Secrets.mp3?dl=1');
      done();
    }).catch((reason) => {
      done(reason);
    });
  });

  after(function () {
    db.dbConnection.end();
  });
});
