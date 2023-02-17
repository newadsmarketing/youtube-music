import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { baseUrl } from '../../api/getAudio';
import Header from '../../components/header/Header';
import { useGetSongsByIdQuery } from '../../reduxtool/services/songsApi';
import './Player.css'
import PlayerControls from './PlayerControls';


const Player = () => {
  const [songUrl, setSongUrl] = useState('');
  const [songsInfo, setSongsInfo] = useState([]);
  const [audioLoad, setAudioLoad] = useState(true);
  const { id } = useParams()
  const { data, isLoading, isError } = useGetSongsByIdQuery(id);

  const [progress, setProgress] = useState(0);

  const getSongUrl = async () => {
    try {
      const response = await fetch(`${baseUrl}/song?id=${id}`, {
        method: "GET",
      })
      const data = await response.json()
      // console.log(data)
      setSongUrl(data)
      setAudioLoad(false)

    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getSongUrl();
  }, [])

  useEffect(() => {
    if (data) {
      setSongsInfo(data.items)
    }
  }, [data])


  const audioRef = useRef();

  const onPlaying = ()=>{
    const duration = audioRef.current.duration;
    const currTime = audioRef.current.currentTime;
    // console.log(duration,currTime)
    setProgress(currTime / duration * 100);
    
  }
 
  
  


 

  return (
    <div className="player-page-section">
      <Header/>
    <div className='player-section absolute-center'>
      
      <div className="player-container">
        <div className="player-song-image-wrapper">
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt="song-poster"
            className='player-song-image'
          />
        </div>
        <div className="player-song-title-channel-wrapper absolute-center">
          <div className="player-song-title">
            {songsInfo[0]?.snippet?.title}
          </div>
          <div className="player-song-channel">
            • {songsInfo[0]?.snippet?.channelTitle}
          </div>
        </div>

        <audio src={songUrl} ref={audioRef} onTimeUpdate={onPlaying} />

       <PlayerControls audioRef={audioRef}
        progress={progress} audioLoad={audioLoad} audioDuration={songsInfo[0]?.contentDetails?.duration} />
        

      </div>
      {isError && <div>{isError}</div> }
    </div>
    </div>
  )
}

export default Player