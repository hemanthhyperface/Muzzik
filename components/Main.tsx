import React, { useState, useEffect } from 'react'
import ListItem from './ListItem'
import { User } from '../interfaces'
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { shuffle } from 'lodash';
import { useRecoilState } from 'recoil';
import { playlistIdState,playlistState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';
type Props = {
  items: User[]
}
const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

const Main = () => {
  const { data: session, status } = useSession();
  const [color, setColor] = useState(null);
  const spotifyApi = useSpotify();
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyApi.getPlaylist(playlistId).then((data) => {
     
      setPlaylist(data.body)
    }).catch((err) => console.log(err,'err'));
  }, [spotifyApi,playlistId])

 


  return (
    <div className='flex-grow h-screen overflow-y-scroll scrollbar-hide'>
      <header className='absolute top-5 right-8'>
        <div className='flex items-center bg-red-300 space-x-3 opacity-90 hover:opacity-10 cursor-pointer rounded-full p-1 pr-2'>
          <img className='rounded-full w-10 h-10' src={session?.user?.image} alt="" />
          <h2>{session?.user?.name}</h2>

        </div>
      </header>

      <section className={`flex items-end space-x-7 bg-gradient-to-b to-black p-8 ${color} h-80 text-white padding-8`}>
        <img className='h-44 w-44 shadow-2xl' src={playlist?.images?.[0]?.url} alt=""></img>
        <div>
          <p>PlayList</p>
          <h1 className='text-2xl md:text-3xl xl:text-5xl font-bold'>{playlist?.name}</h1>
        </div>
      </section>
      <Songs/>
    </div>
  )
}

export default Main
