let playlist = [];

const createPlaylist = function (callback) {
  fetch('http://localhost:3001/playlist')
    .then(res => res.json())
    .then(
      (result) => {
        playlist.splice(0, 0, ...result);
        console.log(playlist, 'SUCCESS POPULATING PLAYLIST IN PLAYLISTJS!');
        callback();
      },
      (error) => {
        callback(error);
        console.log(error, 'ERROR POPULATING PLAYLIST!');
      }
    );
};

module.exports = {
  createPlaylist,
  playlist
};