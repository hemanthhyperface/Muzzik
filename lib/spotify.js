var SpotifyWebApi = require('spotify-web-api-node');

const scopes =
    'user-read-email,playlist-read-private,playlist-read-collaborative,playlist-modify-public,streaming,user-read-private,user-library-read,user-top-read,user-read-playback-state,user-modify-playback-state,user-read-currently-playing,user-read-recently-played,user-follow-read';

// console.log(scopes,'scopes');
const params = {
    scope:scopes
}

const queryParamString = new URLSearchParams(params);
console.log(queryParamString,'qqq');
const LOGIN_URL = `https://accounts.spotifiy.com/authorize?${queryParamString.toString()}`;

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

export default spotifyApi;

export {LOGIN_URL}