import React from 'react';
import ReactPlayer from 'react-player';
//import { v4 as uuidv4 } from 'uuid';
import './App.css';

function showImage(url) {
  if (url === '') {
    return <img id="mainMedia" alt='Texto del año' src={'media/DefaultBackground.jpg'}/>
  } else {
    return <img id="mainMedia" alt='Imagen proyectada' src={url}/>
  }
}

function showVideo(url, playing = false, muted = false) {
  return <ReactPlayer
    id="mainMedia"
    playing={playing}
    muted={muted}
    url={url}
    width={'100%'}
    height={'100%'}
    volume={1}
  />
}

function showVideoThumbnail(url) {
  return <ReactPlayer
    light={true}
    url={url}
    width={'100%'}
    height={'100%'}
  />
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mediaPreview: {},
      activeFile: '',
      fileFormat: 'image',
      mediaFiles: [],
      play: false,
      mute: false
    }
  }
  componentDidMount() {
    document.addEventListener('keydown', (event) => {
      const keyName = event.key;
      if (keyName === 'x') {
        this.resetActiveFile()
      }
      if (keyName === 's') {
        this.showMedia()
      }
      if (keyName === ' ' || keyName === 'p') {
        this.playVideo()
      }
    });
    setInterval(e => {
      const videoThumbnails = document.querySelectorAll('.react-player__preview')
      if (videoThumbnails.length > 0) {
        videoThumbnails[0].click()
      }
    }, 1000)
  }
  mediaPreview(media, e) {
    if (e.isTrusted) {    
      const activeButton = document.querySelector('.activeMediaButton')
      if (activeButton) {
        activeButton.className = e.target.className
      }
      e.target.parentNode.className = 'activeMediaButton'
      this.setState({mediaPreview: media})
    }
  }
  resetActiveFile() {
    this.setState({
      activeFile: '', 
      fileFormat: 'image',
      playing: false,
      mute: false
    })
  }
  playVideo() {
    this.setState({playing: !this.state.playing})
  }
  fullScreen() {
    document.querySelector('#mainMedia').webkitRequestFullscreen()
  }
  showMedia() {
    this.resetActiveFile()
    if (Object.keys(this.state.mediaPreview).length > 0) {
      const {url, type} = this.state.mediaPreview
      this.setState({activeFile: url, fileFormat: type})
    }
  }
  muteVideo() {
    this.setState({mute: !this.state.mute})
  }
  subtractMedia() {
    const {mediaPreview, mediaFiles} = this.state
    const filterFiles = mediaFiles.filter((file => file !== mediaPreview))
    const activeButton = document.querySelector('.activeMediaButton')
    document.querySelector('#mediaUpload').value = ''
    if (activeButton) {
      activeButton.className = 'mediaThumbnail'
    }
    this.setState({mediaFiles: filterFiles})
  }
  addMedia() {
    document.getElementById('mediaUpload').click()
  }
  getFileThumbnail(files) {
    const {mediaFiles} = this.state
    for (const key in files) {
      let file = files[key]
      let type = 'image'
      if (typeof file === 'object') {
        if (file.type.includes('video')) {
          type = 'video'
        }
        let url = URL.createObjectURL(file)
        mediaFiles.push({url, type})
      }
    }
    this.setState({mediaFiles})
  }
  getThumbnails() {
    const {mediaFiles} = this.state
    let key = -1
    const items = mediaFiles.map((media) => {
      key++
      if (media.type === 'image') {
        return <li onClick={(e) => this.mediaPreview(media, e)} className='mediaThumbnail' key={key}><img alt="Preview" src={media.url}></img></li>
      } else {
        return <li onClick={(e) => this.mediaPreview(media, e)} className='mediaThumbnail' key={key}>{showVideoThumbnail(media.url)}</li>
      }
    })
    return <ul className='mediaThumbnails'>{items}</ul>
  }
  render() {
    const {activeFile, fileFormat, playing, mute} = this.state
    const mainMedia = fileFormat === 'image'? showImage(activeFile): showVideo(activeFile, playing, mute);
    return (
      <div className="App">
        <div className='playerContainer '>
          {mainMedia}
        </div>
        <div className='mediaContainer'>
          <div className='mediaControls'>
            <div>
              <button id='xButton' className='mediaButton' onClick={() => this.resetActiveFile()}></button>
              <button id='showButton' className='mediaButton' onClick={() => this.showMedia()}></button>
              <button id={playing? 'pauseButton': 'playButton'} className={fileFormat === 'video'? 'mediaButton': 'displayNone'} onClick={() => this.playVideo()}></button>
              <button id={mute? 'volumeButton': 'muteButton'} className={fileFormat === 'video'? 'mediaButton': 'displayNone'} onClick={() => this.muteVideo()}></button>
              <button id='fullscreenButton' className='mediaButton' onClick={() => this.fullScreen()}></button>
            </div>
            <div>
              <button id='subtractButton' className='mediaButton' onClick={() => this.subtractMedia()}></button>
              <button id='addButton' className='mediaButton' onClick={() => this.addMedia()}></button>
            </div>
          </div>
          {this.getThumbnails()}
          <input
            multiple
            id='mediaUpload'
            type={'file'}
            onChange={e => this.getFileThumbnail(e.target.files)} 
            accept='audio/*,image/*,video/*'
          />
        </div>
      </div>
    );
  }
}

export default App;