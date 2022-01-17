import React, { useState, useEffect } from 'react'
import ListItem from './ListItem'
import { User } from '../interfaces'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react';
import useSpotify from '../hooks/useSpotify';
import { useRecoilState } from 'recoil';
import { playlistIdState } from '../atoms/playlistAtom';

type Props = {
    items: User[]
}

const Sidebar = () => {

    const { data: session, status } = useSession();
    const spotifyApi = useSpotify();
    const [playlist, setPlaylist] = useState([]);
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

    console.log(playlistId,'playlistId');

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists().then((data) => {
                console.log(data,'data');
                setPlaylist(data.body.items);
            }
            )
        }

    }, [session, spotifyApi])

  

    return (
        <div className='h-screen text-gray-500 text-xs lg:text-sm border-r  border-gray-200 overflow-y-scroll scrollbar-hide bg-black p-4 sm:max-w-[12rem] 
        lg:max-w-[15rem] pb-36 '>

            <button className='flex items-center space-x-4 space-y-2 p-2 text-gray-300 hover:text-white active:bg-white'><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg><Link href="/">Home</Link></button>

            <button className='flex items-center space-x-4 space-y-2 p-2 text-gray-300 hover:text-white active:bg-white'><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg><Link href="/search">Search</Link></button>


            <button className='flex items-center space-x-4 space-y-2 p-2 text-gray-300 hover:text-white active:bg-white'><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg><Link href="/playlist">Your Library</Link></button>
            <hr className='border-t-[0.1px] border-gray-900'/>
            {playlist && playlist.length > 0 && playlist.map((item) => {
               return <button key={item.id} onClick={() =>setPlaylistId(item.id)} className='flex items-center space-x-4 space-y-2'><p className=' hover:text-white p-2 truncate'>{item.name}</p></button>
            })}
        </div>
    )
}

export default Sidebar
