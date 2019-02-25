const axios = require('axios');
let playlist = [];

const createPlaylist = function (callback) {
  axios.get('/playlist')
    .then(res => {
      return res.data;
    })
    .then(
      (result) => {
        for (var i = 0; i < result.length; i++) {
          playlist.push(result[i]);
        }
        callback();
      })
    .catch(
      (error) => {
        callback(error);
        console.log(error, 'ERROR POPULATING PLAYLIST!');
      });
};

module.exports = {
  createPlaylist,
  playlist
};