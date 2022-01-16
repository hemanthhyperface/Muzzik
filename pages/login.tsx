import React from 'react'
import { getProviders, signIn,getSession } from "next-auth/react";

export default function login({providers}) {
    
    console.log("Providers: ", providers);
    return (
        <div className='flex flex-col items-center bg-black min-h-screen w-full justify-center'>
           <img className='w-52 mb-5' src='https://links.papareact.com/9xl' alt=""/>
           {Object.values(providers).map((provider) => {
               console.log(provider,'provider');
               return<div key={provider.name}><button className='bg-green-500 text-white p-5 rounded-lg'
               onClick={() => signIn('twitter', { callbackUrl: 'http://localhost:8000' })}>{provider.name}</button></div>
            })}
        </div>
    )
}

export async function getServerSideProps() {
    const providers = await getProviders();
    
    return {
          props: { providers },
    };
}
