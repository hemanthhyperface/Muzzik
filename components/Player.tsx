import React, { useState, useEffect,useCallback } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react';
import useSpotify from '../hooks/useSpotify';
import { playlistState } from '../atoms/playlistAtom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import { HeartIcon, ReplyIcon, VolumeUpIcon as VolumeDownIcon } from '@heroicons/react/outline';
import { RewindIcon, FastForwardIcon, PauseIcon, PlayIcon, VolumeUpIcon, SwitchHorizontalIcon } from '@heroicons/react/solid';
import { debounce } from 'lodash';

export default function Player() {
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const { data: session, status } = useSession();
    const spotifyApi = useSpotify();
    const [volume, setVolume] = useState(50);
    const songInfo = useSongInfo();

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            console.log(data,'data');
            if (data.body?.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false);
            }else{
                spotifyApi.play();
                setIsPlaying(true);  
            }
        })
    }

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                setCurrentTrackId(data.body?.item?.id)
                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                })
            })
        }
    }

    const debounceAdjustVolume = useCallback(
        debounce((volume) =>{
            spotifyApi.setVolume(volume).catch((err) => {});
        },500),[]
    );

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
        }

    }, [currentTrackId, spotifyApi, session])

    useEffect(() => {
       
        if(volume > 0 && volume <100){
            debounceAdjustVolume(volume)
        }

    }, [volume])
    return (
        <div className='h-24 bg-gradient-to-b  from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
            <div className='flex items-center space-x-4'>
                <img className='hidden md:inline h-10 w-10' src={songInfo?.album.images?.[0]?.url} alt='' />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <h3>{songInfo?.artists?.[0]?.name}</h3>
                </div>
            </div>
            <div className='flex items-center justify-evenly'>
                <SwitchHorizontalIcon className='h-5 w-5 cursor-pointer hover:scale-125 transition transform  duration-100 ease-out' />
                <RewindIcon className='h-5 w-5 cursor-pointer hover:scale-125 transition transform  duration-100 ease-out' />

                {isPlaying ? (
                    <PauseIcon className='h-10 w-10 cursor-pointer hover:scale-125 transition transform  duration-100 ease-out ' onClick={handlePlayPause} />
                ) : <PlayIcon className='h-10 w-10 cursor-pointer hover:scale-125 transition transform  duration-100 ease-out' onClick={handlePlayPause} />}

                <FastForwardIcon className='h-5 w-5 cursor-pointer hover:scale-125 transition transform  duration-100 ease-out ' />
                <ReplyIcon className='h-5 w-5 cursor-pointer hover:scale-125 transition transform  duration-100 ease-out ' />
            </div>

            <div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'> 
                <VolumeDownIcon className='h-5 w-5 cursor-pointer hover:scale-125 transition transform  duration-100 ease-out ' onClick={() => volume > 0  &&  setVolume(volume+10)}/>
                <input className='w-18  md:w-28' onChange={(e) => setVolume(Number(e.target.value))} type="range" min={0} max={100}/>
                <VolumeUpIcon className='h-5 w-5 cursor-pointer hover:scale-125 transition transform  duration-100 ease-out ' onClick={() => volume < 100  &&  setVolume(volume+10)}/>
            </div>
        </div>
    )
}
