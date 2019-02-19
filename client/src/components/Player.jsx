import React from 'react';
import { createPlaylist, playlist } from '../playlist.js';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      trackId: null,
      isplaying: false,
      sourceURL: null,
      previous: null,
      next: null,
      progressbar: 0,
      currentTime: '00:00',
      duration: '00:00',
      loop: false,
      shuffle: false
    };

    this.player = new Audio();
    this.playTrack = this.playTrack.bind(this);
    this.startPlayer = this.startPlayer.bind(this);
    this.playOrPause = this.playOrPause.bind(this);
    this.playNext = this.playNext.bind(this);
    this.playPrev = this.playPrev.bind(this);

  }

  //if track is requested by a separate component in scootify 
  playTrack(trackId) {
    fetch('http://localhost:3001/track/' + trackId, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result, 'SUCCESS GETTING TRACK ' + trackId);
          this.setState({
            id: result[0].id,
            trackId: trackId,
            isplaying: true,
            sourceURL: result.track_file_url,
          });
          this.player.src = this.state.sourceURL;
          this.player.play();
        },
        (error) => {
          console.log(error, 'ERROR FETCHING TRACK ' + trackID);
        }
      );
  }

  startPlayer(index) {
    this.setState({
      id: playlist[index].id,
      trackId: playlist[index].track_id,
      sourceURL: playlist[index].track_file_url,
      isplaying: true,
    });
    this.player.src = this.state.sourceURL;
    this.player.play();
    if (this.state.previous === null) {
      this.setState({ previous: index });
    } else if (this.state.shuffle) {
      this.setState({ previous: index });
    } else {
      this.setState({ previous: index - 1 });
    }
  }

  playOrPause() {
    if (this.player.paused) {
      this.player.play();
      this.setState({ isplaying: true });
    } else {
      this.player.pause();
      this.setState({ isplaying: false });
    }
  }

  playNext() {
    if (this.state.shuffle) {
      this.setState({ id: (Math.floor(Math.random() * playlist.length) + 1) });
      this.startPlayer(this.state.id - 1);
    } else {
      if (this.state.index === playlist.length - 1) {
        this.player.pause();
        this.setState({ isplaying: false });
      } else {
        this.setState({ next: this.state.index + 1 });
        this.startPlayer(this.state.next);
      }
    }
  }

  playPrev() {
    if (this.state.currentTime <= '00:03') {
      this.startPlayer(this.state.id - 1);
    }
    if (this.state.previous >= 0) {
      this.startPlayer(this.state.previous);
    } else {
      this.player.pause();
      this.setState({ isplaying: false });
    }
  }

  componentDidMount() {
    this.player = document.getElementById('playback');
    createPlaylist((error) => {
      if (error) {
        console.log(error, 'ERROR IN COMPONENTDIDMOUNT');
      } else {
        console.log('SUCCESS!');
        console.log(playlist);
        // console.log(this);
        this.setState({
          id: playlist[0].id,
          trackId: playlist[0].trackId,
          sourceURL: playlist[0].track_file_url,
        });
        // this.startPlayer(0);
      }
    });

  }

  render() {
    return (
      <div id="player">
        <div className="middle-part">
          <audio id="playback"></audio>
          <div className="controls">
            <button className={this.state.shuffle ? "no-style shuffle active" : "no-style shuffle"} onClick={this.toggleShuffle}><i className="fa fa-random"></i></button>
            <button className="no-style" onClick={this.playPrev}><i className="fa fa-step-backward"></i></button>
            <button className="no-style play" onClick={this.playOrPause}>
              <i className={this.state.isplaying ? "far fa-pause-circle" : "far fa-play-circle"}></i>
            </button>
            <button className="no-style" onClick={this.playNext}><i className="fa fa-step-forward"></i></button>
            <button className={this.state.loop ? "no-style loop active" : "no-style loop"} onClick={this.toggleLoop}><i className="fa fa-sync-alt"></i></button>
          </div>
        </div>
      </div>
    );
  }
}

export default Player;