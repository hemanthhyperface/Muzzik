import SpotifyWebApi from "spotify-web-api-node/src/spotify-web-api";
import { signIn, signOut, useSession } from 'next-auth/react';
import  React,{useState,useEffect} from 'react'
import spotifyApi from "../lib/spotify";

export default function useSpotify() {

    const { data: session, status } = useSession();

    useEffect(() => {
        console.log(session,'session')
       if(session){
           if(session.error === 'RefreshAccessTokenError'){
               signIn();
           }

           spotifyApi.setAccessToken(session.user.accessToken);
       }
    }, [session]);

    return spotifyApi;
   
}
