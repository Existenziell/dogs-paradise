import { useEffect, useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import Head from 'next/head'
import Link from 'next/link'
import Avatar from '../components/Avatar'
import Onboarding from '../components/Onboarding'
import updateProfile from '../lib/updateProfile'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'
import SupaAuth from '../components/SupaAuth'

const Profile = ({ i18n }) => {
  const appCtx = useContext(AppContext)
  const { session, notify, currentUser } = appCtx

  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [email, setEmail] = useState(null)
  const [role, setRole] = useState(null)
  const [quote, setQuote] = useState(null)
  const [is_premium, setIsPremium] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username)
      setEmail(currentUser.email)
      setRole(currentUser.role)
      setQuote(currentUser.quote)
      setAvatarUrl(currentUser.avatar_url)
      setCreatedAt(currentUser.created_at)
    }
  }, [currentUser])

  if (!session) return <SupaAuth />

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>

      <div className='py-24 px-8 profile'>
        <h1 className='text-4xl md:text-6xl mb-12 mt-4'>{i18n.T1}</h1>
        <h2 className='text-left mb-2'>Your Membership Card</h2>

        <div className='p-4 md:p-8 mx-auto rounded-xl text-white bg-gradient-to-tl from-primary to-secondary shadow-xl overflow-hidden'>

          {appCtx.showOnboarding ?
            <Onboarding />
            :
            <div className='flex flex-row justify-between gap-4'>
              <div className='w-1/3'>
                <Avatar
                  url={avatar_url}
                  // size={150}
                  onUpload={(url) => {
                    setAvatarUrl(url)
                    updateProfile({ username, email, role, quote, avatar_url: url, setLoading, notify })
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
                  <p className='text-2xl md:text-4xl whitespace-nowrap'>{username}</p>
                  <p className='text-xs'>{quote}</p>
                </div>
                <div className='text-right text-sm'>
                  <p className='text-sm'>Joined: {createdAt?.slice(0, 10)}</p>
                  <p>Member status: {is_premium ? `Premium` : `Free`}</p>
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
