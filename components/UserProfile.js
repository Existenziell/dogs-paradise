import { useState, useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import Head from 'next/head'
import Avatar from './Avatar'
import getProfile from '../lib/getProfile'
import updateProfile from '../lib/updateProfile'
import Onboarding from './Onboarding'
import Link from 'next/link'

export default function Profile({ session, i18n }) {
  const ctx = useContext(AppContext)
  const userCtx = ctx.user

  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [quote, setQuote] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  useEffect(() => {
    getData()
  }, [session])

  const getData = async () => {
    const data = await getProfile(setLoading)

    if (data) {
      setUsername(data.username)
      setQuote(data.quote)
      setCreatedAt(data.created_at)
      setAvatarUrl(data.avatar_url)
    } else {
      userCtx.setShowOnboarding(true)
    }
  }

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>

      <div className='pt-24 px-8 profile'>
        <h1 className='text-6xl mb-12'>{i18n.T1}</h1>
        <h2 className='text-left mb-2'>Your Membership Card</h2>

        <div className='p-4 md:p-8 mx-auto rounded-xl text-white bg-gradient-to-tl from-primary to-secondary shadow-xl overflow-hidden'>

          {userCtx.showOnboarding ?
            <Onboarding />
            :
            <div className='flex flex-row justify-between gap-4'>
              <div className='w-1/3'>
                <Avatar
                  url={avatar_url}
                  size={150}
                  onUpload={(url) => {
                    setAvatarUrl(url)
                    updateProfile({ username, quote, avatar_url: url, setLoading })
                  }}
                />
              </div>

              <div className='flex text-brand-dark w-1/2 gap-2 items-end justify-center'>
                <Link href='/services/pickup'>
                  <a className='shadow bg-slate-100 rounded-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all relative h-max w-32'>
                    <h2 className='bg-white p-3 text-lg rounded-t-lg w-full'>Pickup</h2>
                    <img src='/icons/services/pickup.png' alt='Pickup Service' width={60} height={60} className='my-4' />
                  </a>
                </Link>
                <Link href='/services/delivery'>
                  <a className='shadow bg-slate-100 rounded-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all relative h-max w-32'>
                    <h2 className='bg-white p-3 text-lg rounded-t-lg w-full'>Delivery</h2>
                    <img src='/icons/services/delivery.svg' alt='Pickup Service' width={60} height={60} className='my-4' />
                  </a>
                </Link>
              </div>

              <div className='flex flex-col h-full gap-4'>
                <div className='text-right  bg-white/10 backdrop-blur-md p-4 rounded-xl max-w-max self-end'>
                  <p className='text-2xl md:text-4xl'>{username}</p>
                  <p className='text-xs'>{quote}</p>
                </div>
                <div className='text-right text-sm'>
                  <p className='text-sm'>Joined: {createdAt?.slice(0, 10)}</p>
                  <p>Member status: Free</p>
                </div>



                <div className='flex justify-end gap-4'>
                  <img src='/img/dogs/dog1.jpg' alt='Dog1' className='rounded-full w-16 shadow-lg border-2 border-white cursor-pointer hover:scale-105 transition-all' />
                  <img src='/img/dogs/dog2.jpg' alt='Dog2' className='rounded-full w-16 shadow-lg border-2 border-white cursor-pointer hover:scale-105 transition-all' />
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
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='mt-2'>
            <label htmlFor="quote" className='block text-xs'>Quote</label>
            <input
              id="quote"
              type="text"
              value={quote || ''}
              onChange={(e) => setQuote(e.target.value)}
            />
          </div>

          <div>
            <button
              className="link mt-2"
              onClick={() => updateProfile({ username, quote, avatar_url, setLoading })}
              disabled={loading}
            >
              {loading ? 'Loading ...' : 'Save'}
            </button>
          </div>
        </div>

      </div>
    </>
  )
}
