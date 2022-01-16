import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.accessToken);

    const { body: refreshedTokens } = await spotifyApi.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: 'https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private,playlist-read-collaborative,playlist-modify-public,streaming,user-read-private,user-library-read,user-top-read,user-read-playback-state,user-modify-playback-state,user-read-currently-playing,user-read-recently-played,user-follow-read',
    }),
  ],
  // secret: process.env.JWT_SECRET,
  // pages: {
  //   signIn: "/login",
  // },
  // session:{
  //   jwt:true
  // },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at * 1000,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
        };
      }
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken
      session.user.username = token.username;
      

      return session;
    },
  },

  // callbacks: {
  //   async jwt({token, account}) {
  //     if (account) {
  //       token.accessToken = account.refresh_token;
  //     }
  //     return token;
  //   },
  //   async session(session, user) {
  //     session.user = user;
  //     return session;
  //   },
  // },
});

