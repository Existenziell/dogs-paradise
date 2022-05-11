
import { useEffect, useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import { LogoutBtn } from '../components/LogoutBtn'
import PacmanLoader from 'react-spinners/PacmanLoader'
import Head from 'next/head'
import Auth from '../components/Auth'
import Avatar from '../components/Avatar'
import Onboarding from '../components/Onboarding'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'

const Profile = ({ i18n }) => {
  const ctx = useContext(AppContext)
  const userCtx = ctx.user
  const appCtx = ctx.appState

  const [session, setSession] = useState(null)
  useEffect(() => {
    setSession(supabase.auth.session())
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    userCtx.getProfile()
  }, [session])

  const updateProfile = () => {
    const { username, quote, avatarUrl } = userCtx
    userCtx.updateProfile({ username, quote, avatarUrl })
  }
  // console.log(appCtx.loggedInUser);
  if (!appCtx.loggedInUser) return <Auth />
  if (appCtx.loading) return <div className='pt-32'><PacmanLoader color={'var(--color-brand)'} size={30} /></div>
  // if (userCtx.showOnboarding) return <Onboarding />

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>

      <LogoutBtn />

      <div className='pt-24 px-8 profile'>
        <h1 className='text-6xl mb-12'>{i18n.T1}</h1>
        <h2 className='text-left mb-2'>Your Membership Card:</h2>

        <div className='p-4 md:p-8 mx-auto rounded-xl text-white bg-gradient-to-tl from-primary to-secondary shadow-xl overflow-hidden'>

          {userCtx.showOnboarding ?
            <Onboarding />
            :
            <div className='flex flex-row justify-between gap-4'>
              <div className='w-1/3'>
                <Avatar
                  url={userCtx.avatarUrl}
                />
              </div>
              <div className='flex flex-col h-full gap-4'>
                <div className='text-right  bg-white/10 backdrop-blur-md p-4 rounded-xl max-w-max self-end'>
                  <p className='text-2xl md:text-4xl'>{userCtx.username}</p>
                  <p className='text-xs'>{userCtx.quote}</p>
                </div>
                <div className='text-right text-sm'>
                  <p className='text-sm'>Joined: {userCtx.createdAt?.slice(0, 10)}</p>
                  <p>Member status: Free</p>
                </div>

                <div className='flex justify-end gap-4'>
                  <img src='/img/dogs/dog1.jpg' alt='Dog1' className='rounded-full w-16 shadow-lg border-2 border-white cursor-pointer' />
                  <img src='/img/dogs/dog2.jpg' alt='Dog2' className='rounded-full w-16 shadow-lg border-2 border-white cursor-pointer' />
                </div>
              </div>
            </div>
          }
        </div>

        <div className="py-16 text-left">
          <h2 className='font-bold mb-4'>Edit:</h2>
          <div>
            <label htmlFor="username" className='block text-xs'>Name</label>
            <input
              id="username"
              type="text"
              value={userCtx.username || ''}
              onChange={(e) => userCtx.setUsername(e.target.value)}
            />
          </div>
          <div className='mt-2'>
            <label htmlFor="quote" className='block text-xs'>Quote</label>
            <input
              id="quote"
              type="text"
              value={userCtx.quote || ''}
              onChange={(e) => userCtx.setQuote(e.target.value)}
            />
          </div>

          <div>
            <button
              className="link mt-2"
              onClick={updateProfile}
              disabled={appCtx.loading}
            >
              {appCtx.loading ? 'Loading ...' : 'Save'}
            </button>
          </div>
        </div>

      </div>
    </>
  )
}

export async function getStaticProps(context) {
  let i18n
  context.locale === 'en' ?
    i18n = langEN.profile :
    i18n = langES.profile
  return {
    props: { i18n },
  }
}

export default Profile  
