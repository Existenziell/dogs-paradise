import { Auth as SupaAuth } from '@supabase/ui'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { BASE_URL } from '../lib/config'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Header from './Header'
import AddToHomeScreen from './AddToHomeScreen'

const Auth = () => {
  // Check if user has theme in localStorage
  // If so, we assume user wants to sign_in, otherwise we show sign_up
  const [view, setView] = useState('sign_up')
  useEffect(() => {
    if (localStorage.theme) {
      setView('sign_in')
    }
  }, [])
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Authentication | Dog&apos;s Paradise</title>
        <meta name='description' content='Authentication | Dog&apos;s Paradise' />
      </Head>
      <Header content='Signup/Signin' />

      <div className='flex flex-col items-center justify-center px-4 py-24 md:px-8'>
        <AddToHomeScreen />

        <div className='max-w-xl mt-6'>
          <SupaAuth.UserContextProvider supabaseClient={supabase}>
            <SupaAuth
              view={view}
              supabaseClient={supabase}
              socialLayout="horizontal"
              socialButtonSize="xlarge"
              socialColors={true}
              magicLink
              redirectTo={`${BASE_URL}${router.pathname}`}
              providers={['google', 'facebook', 'github']}
            />
          </SupaAuth.UserContextProvider>
        </div>
        <img src='/icons/paws-turquoise.webp' alt='Paws' className='w-32 my-12 block' />
      </div>
    </>
  )
}

export default Auth
