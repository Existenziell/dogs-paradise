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
  const [name, setName] = useState(null)
  const [username, setUsername] = useState(null)
  const [email, setEmail] = useState(null)
  const [isPremium, setIsPremium] = useState(null)
  const [role, setRole] = useState(null)
  const [quote, setQuote] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)
  const [notificationMsg, setNotificationMsg] = useState('')

  useEffect(() => {
    getData()
  }, [session])

  const getData = async () => {
    const data = await getProfile(setLoading)

    if (data) {
      setName(data.name)
      setUsername(data.username)
      setEmail(data.email)
      setIsPremium(data.is_premium)
      setRole(data.role)
      setQuote(data.quote)
      setAvatarUrl(data.avatar_url)
      setCreatedAt(data.created_at)
    } else {
      userCtx.setShowOnboarding(true)
    }
  }

  const notify = (msg) => {
    const notification = document.querySelector('.notification-dog')
    notification.classList.remove('-translate-y-20')
    setNotificationMsg(msg)
    setTimeout(() => {
      notification.classList.add('-translate-y-20')
    }, 3000)
  }

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>

      <div className='py-24 px-8 profile'>
        <div className="fixed top-0 left-0 right-0 w-full notification-dog -translate-y-20 transition-all duration-500 z-30">
          <div className='bg-brand-dark text-white flex items-center justify-center py-6 '>
            {notificationMsg}
          </div>
        </div>
        <h1 className='text-4xl md:text-6xl mb-12 mt-4'>{i18n.T1}</h1>
        <h2 className='text-left mb-2'>Your Membership Card</h2>

        <div className='p-4 md:p-8 mx-auto rounded-xl text-white bg-gradient-to-tl from-primary to-secondary shadow-xl overflow-hidden'>

          {userCtx.showOnboarding ?
            <Onboarding />
            :
            <div className='flex flex-row justify-between gap-4'>
              <div className='w-1/3'>
                <Avatar
                  url={avatar_url}
                  // size={150}
                  onUpload={(url) => {
                    setAvatarUrl(url)
                    updateProfile({ name, username, email, address, is_premium, role, quote, avatar_url: url, setLoading })
                  }}
                />
              </div>

              <div className='hidden md:flex text-brand-dark w-2/3 gap-2 items-end justify-center'>
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
                  <p>Member status: {isPremium ? `Premium` : `Free`}</p>
                </div>

                <div className='flex justify-end gap-4'>
                  <img src='/img/dogs/dog1.jpg' alt='Dog1' className='rounded-full w-16 shadow-lg border-2 border-white cursor-pointer hover:scale-105 transition-all' />
                  <img src='/img/dogs/dog2.jpg' alt='Dog2' className='rounded-full w-16 shadow-lg border-2 border-white cursor-pointer hover:scale-105 transition-all' />
                </div>
              </div>
            </div>
          }
        </div>

        <div className="mt-8 text-left shadow max-w-max bg-slate-300 p-4">
          <h2 className='font-bold text-xl mb-4'>Edit:</h2>
          <div>
            <label htmlFor="name" className='block text-xs mt-2'>Name</label>
            <input
              id="name"
              type="text"
              value={name || ''}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="username" className='block text-xs mt-2'>Username</label>
            <input
              id="username"
              type="text"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className='block text-xs mt-2'>Email</label>
            <input
              disabled
              id="email"
              type="text"
              value={email || ''}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="isPremium" className='block text-xs mt-2'>isPremium?</label>
            <input
              id="isPremium"
              type="text"
              value={isPremium || ''}
              onChange={(e) => setIsPremium(e.target.value)}
            />
          </div>
          <div className='mt-2'>
            <label htmlFor="quote" className='block text-xs mt-2'>Quote</label>
            <input
              id="quote"
              type="text"
              value={quote || ''}
              onChange={(e) => setQuote(e.target.value)}
            />
          </div>

          <div>
            <button
              className="link mt-6 text-xl"
              onClick={() => updateProfile({ username, quote, avatar_url, setLoading, notify })}
              disabled={loading}
              aria-label='Update Profile'
            >
              {loading ? 'Loading ...' : 'Save'}
            </button>
          </div>
        </div>

      </div>
    </>
  )
}
