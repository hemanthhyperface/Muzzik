import React,{useState,useEffect} from 'react'
import useSpotify from '../hooks/useSpotify';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';

export default function useSongInfo() {

    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const spotifyApi = useSpotify();
    const [songInfo,setSongInfo] = useState(null);

    useEffect(() => {
       const fetchSongInfo = async () => {
        console.log(currentTrackId,'currentTrackId');
        if(currentTrackId){
            const trackInfo =  await fetch(
                `https://api.spotify.com/v1/tracks/${currentTrackId}`,
                {
                    headers:{
                        Authorization:`Bearer ${spotifyApi.getAccessToken()}`
                    }
                }
            ).then(res => res.json());
            console.log(trackInfo,'songInfo11');
            setSongInfo(trackInfo);
        }

        // return songInfo;
       }

       fetchSongInfo();
      
     
      
    }, [currentTrackId,spotifyApi])
    return songInfo;
    
}