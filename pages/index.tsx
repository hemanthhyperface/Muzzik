import Link from 'next/link'
import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import Main from '../components/Main'
import Player from '../components/Player'

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession, signIn, signOut, getSession } from 'next-auth/react';

const IndexPage = ({ providers }) => {

  const { data: session } = useSession();
  const router = useRouter()

  console.log(session,'session1');
  useEffect(() => {
    if(session == null){
      router.push('/api/auth/signin');
    }
  }, []);
  
  

  return <><div className='flex flex-row bg-black'>
    <Sidebar />
    <Main />

  </div>
    <div className='sticky bottom-0'>
      <Player />
    </div></>


}

export default IndexPage

export async function getServerSideProps(context) {
  return {
    props: {
      //Why: To check if the user logged-in or not, get the session and pass it to Home component
      session: await getSession(context),
    },
  };
}
