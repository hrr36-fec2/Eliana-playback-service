import React from 'react';
import { createPlaylist, playlist } from '../playlist.js';
import MetaData from './MetaData.jsx';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: null,
      id: null,
      trackId: null,
      title: null,
      artist: null,
      albumThumbnail: null,
      favorite: 0,
      isplaying: false,
      sourceURL: null,
      previous: null,
      next: null,
      progressbar: 0,
      volumebar: 100,
      volumeup: true,
      currentSeconds: 0,
      totalSeconds: 0,
      loop: false,
      shuffle: false
    };

    this.player = new Audio();
    this.playSpecificTrack = this.playSpecificTrack.bind(this);
    this.setCurrentSong = this.setCurrentSong.bind(this);
    this.handlePlayOrPause = this.handlePlayOrPause.bind(this);
    this.handlePlayNext = this.handlePlayNext.bind(this);
    this.handlePlayPrev = this.handlePlayPrev.bind(this);
    this.onVolumeBarClick = this.onVolumeBarClick.bind(this);
    this.toggleVolume = this.toggleVolume.bind(this);
    this.onProgressBarClick = this.onProgressBarClick.bind(this);
    this.toggleLoop = this.toggleLoop.bind(this);
    this.toggleShuffle = this.toggleShuffle.bind(this);
    this.autoplayListener = this.autoplayListener.bind(this);
    this.metadataListener = this.metadataListener.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
    this.formatTime = this.formatTime.bind(this);

    this.player.addEventListener('ended', this.handlePlayNext);
  }

  //if track is requested by a separate component in scootify 
  playSpecificTrack(trackId) {
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
            sourceURL: result[0].track_file_url,
            title: result[0].track_title,
            favorite: result[0].favorite,
            artist: result[0].artist_name,
            albumThumbnail: result[0].album_image_file,
          });
        })
      .then(() => {
        this.player.src = this.state.sourceURL;
        this.player.play();
      })
      .catch(
        (error) => {
          console.log(error, 'ERROR FETCHING TRACK ' + trackID);
        }
      );
  }

  setCurrentSong(index, autoplay) {
    this.setState({
      current: index,
      id: playlist[index].id,
      trackId: playlist[index].track_id,
      sourceURL: playlist[index].track_file_url,
      title: playlist[index].track_title,
      artist: playlist[index].artist_name,
      albumThumbnail: playlist[index].album_image_file,
      favorite: playlist[index].favorite,
      previous: Math.max(0, index - 1),
      next: (index + 1) % playlist.length,
    }, () => {
      this.player.src = this.state.sourceURL;
      this.player.addEventListener('loadedmetadata', this.metadataListener);
      this.player.load();

      if (autoplay) {
        this.player.addEventListener('canplay', this.autoplayListener);
      }
    });
  }

  autoplayListener() {
    this.player.removeEventListener('canplay', this.autoplayListener);
    this.player.pause();
    this.handlePlayOrPause();
  }

  metadataListener() {
    this.player.removeEventListener('loadedmetadata', this.metadataListener);
    this.setState({ 'totalSeconds': this.player.duration });
  }

  updateProgress() {
    this.setState({
      'currentSeconds': this.player.currentTime,
      'progressbar': this.player.currentTime / this.player.duration * 100
    });
  }

  handlePlayOrPause() {
    let isReady = this.player.readyState;
    console.log(isReady, 'Should be greater than 0');
    if (isReady > 0 && this.player.paused) {
      this.player.play().then(() => {
        this.player.addEventListener('timeupdate', this.updateProgress);
        this.setState({ isplaying: true });
      })
        .catch(error => {
          console.log(error, 'ERROR IN PLAY PROMISE');
          this.setState({ isplaying: false });
        });
    } else {
      this.player.removeEventListener('timeupdate', this.updateProgress);
      this.player.pause();
      this.setState({ isplaying: false });
    }
  }

  handlePlayNext() {
    if (this.state.shuffle) {
      this.setCurrentSong(Math.floor(Math.random() * playlist.length), true);
    } else {
      this.setCurrentSong(this.state.next, true);
    }
  }

  handlePlayPrev() {
    if (this.player.currentTime <= 3) {
      this.setCurrentSong(this.state.previous, true);
    } else {
      this.setCurrentSong(this.state.current, true);
    }
  }

  formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.round(seconds % 60);
    min = (min < 10) ? '0' + min : min;
    sec = (sec < 10) ? '0' + sec : sec;
    return min + ':' + sec;
  }

  onProgressBarClick(e) {
    const offsetX = e.nativeEvent.offsetX;
    const offsetWidth = e.nativeEvent.target.offsetWidth;
    const percent = offsetX / offsetWidth;
    this.player.currentTime = percent * this.player.duration;
    this.updateProgress();
  }

  onVolumeBarClick(e) {
    const offsetX = e.nativeEvent.offsetX;
    const offsetWidth = e.nativeEvent.target.offsetWidth;
    this.player.volume = offsetX / offsetWidth;
    this.setState({ 'volumebar': this.player.volume * 100 });
  }

  toggleLoop() {
    this.setState({ loop: !this.state.loop }, function () {
      this.player.loop = this.state.loop;
    });
  }

  toggleShuffle() {
    this.setState({ shuffle: !this.state.shuffle });
  }

  toggleVolume() {
    this.setState({ volumeup: !this.state.volumeup }, function () {
      if (!this.state.volumeup) {
        this.player.volume = 0;
        this.setState({ 'volumebar': 0 });
      } else {
        this.player.volume = 1;
        this.setState({ 'volumebar': 100 });
      }
    });
  }

  toggleFavorite() {
    if (this.state.favorite === 0) {
      this.setState({ favorite: 1 });
    } else {
      this.setState({ favorite: 0 });
    }
  }

  componentDidMount() {
    createPlaylist((error) => {
      if (error) {
        console.log(error, 'ERROR IN COMPONENTDIDMOUNT');
      } else {
        console.log(playlist, 'THIS IS THE PLAYLIST');
        this.setCurrentSong(0);
      }
    });
  }


  render() {
    return (
      <div id="player">
        <MetaData
          title={this.state.title}
          artist={this.state.artist}
          albumThumbnail={this.state.albumThumbnail}
          onClick={() => this.toggleFavorite()}
          favorite={this.state.favorite}
        />
        <div className="now-playing-bar__center">
          <div className="controls">
            <button className={this.state.shuffle ? "no-style shuffle active" : "no-style shuffle"} onClick={this.toggleShuffle}><ion-icon name="shuffle"></ion-icon></button>
            <button className="no-style" onClick={this.handlePlayPrev}><ion-icon name="skip-backward"></ion-icon></button>
            <button className="no-style play" onClick={this.handlePlayOrPause}>
              <i className={this.state.isplaying ? "far fa-pause-circle" : "far fa-play-circle"}></i>
            </button>
            <button className="no-style" onClick={this.handlePlayNext}><ion-icon name="skip-forward"></ion-icon></button>
            <button className={this.state.loop ? "no-style loop active" : "no-style loop"} onClick={this.toggleLoop}><ion-icon name="repeat"></ion-icon></button>
          </div>

          <div className="progress">
            <div className="progress-time">{this.formatTime(this.state.currentSeconds)}</div>
            <div className="bar" onClick={this.onProgressBarClick}>
              {this.state.progressbar > 0 &&
                <div style={{ width: this.state.progressbar + '%' }}></div>
              }
            </div>
            <div className="progress-time">{this.formatTime(this.state.totalSeconds)}</div>
          </div>
        </div>

        <div className="volume-bar">
          <button className="no-style" onClick={this.toggleVolume}>
            <i className={this.state.volumeup ? "fa fa-volume-up" : "fa fa-volume-off"}></i>
          </button>
          <div className="fill" onClick={this.onVolumeBarClick}>
            <div style={{ width: this.state.volumebar + '%' }}></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Player;