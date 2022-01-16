import React from 'react'
import { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react";
import {
  RecoilRoot,
} from 'recoil';
import '../styles/index.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <SessionProvider session={pageProps.session}><RecoilRoot><Component {...pageProps} /></RecoilRoot></SessionProvider>
}

export default MyApp