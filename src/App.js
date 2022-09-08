import React from 'react';
import ReactPlayer from 'react-player';
//import { v4 as uuidv4 } from 'uuid';
import './App.css';

function showImage(url) {
  if (url === '') {
    return <img alt='Texto del año' src={'media/DefaultBackground.jpg'}/>
  } else {
    return <img alt='Imagen proyectada' src={url}/>
  }
}

function showVideo(file) {
  console.log(file)
}

function showVideoThumbnail(url) {
  return <ReactPlayer
    light={true}
    previewTabIndex={75}
    url={url}
    width={'100%'}
    height={'100%'}
    controls={false}
  />
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeFile: '',
      fileFormat: 'image',
      mediaFiles: []
    }
  }
  componentDidMount() {
    setInterval(e => {
      const videoThumbnails = document.querySelectorAll('.react-player__preview')
      if (videoThumbnails.length > 0) {
        videoThumbnails[0].click()
      }
    }, 2000)
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
      if (media.type == 'image') {
        return <li className='mediaThumbnail' key={key}><img src={media.url}></img></li>
      } else {
        return <li className='mediaThumbnail' key={key}>{showVideoThumbnail(media.url)}</li>
      }
    })
    key++
    items.push(<button className='addMediaButton' key={key} onClick={() => document.getElementById('mediaUpload').click()}>+</button>)
    return <ul className='mediaThumbnails'>{items}</ul>
  }
  render() {
    const {activeFile, fileFormat} = this.state
    const mainMedia = fileFormat == 'image'? showImage(activeFile): showVideo(activeFile);
    return (
      <div className="App">
        <div className='playerContainer '>
          {mainMedia}
        </div>
        <div className='mediaContainer'>
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
