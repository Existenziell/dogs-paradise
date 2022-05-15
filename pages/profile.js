import { useEffect, useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import Head from 'next/head'
import Link from 'next/link'
import Auth from '../components/Auth'
import Avatar from '../components/Avatar'
import Onboarding from '../components/Onboarding'
import AddToHomeScreen from '../components/AddToHomeScreen'
import updateProfile from '../lib/updateProfile'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'
import ControlPanel from '../components/ControlPanel'
import LogoutBtn from '../components/LogoutBtn'
import DarkModeToggle from '../components/DarkModeToggle'
import LoginBtn from '../components/LoginBtn'
import Header from '../components/Header'

const Profile = ({ i18n }) => {
  const appCtx = useContext(AppContext)
  const { session, notify, currentUser } = appCtx

  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState(null)
  const [email, setEmail] = useState(null)
  const [quote, setQuote] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username)
      setEmail(currentUser.email)
      setQuote(currentUser.quote)
      setAvatarUrl(currentUser.avatar_url)
    }
  }, [currentUser])

  if (!session) return <Auth />

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>

      <Header content={i18n.T1} />

      <div className='px-8 pb-24 profile flex flex-col items-center justify-center'>

        <Avatar
          url={avatar_url}
          size={300}
          onUpload={(url) => {
            setAvatarUrl(url)
            updateProfile({ username, quote, avatar_url: url, setLoading, notify })
          }}
        />

        <div className="my-8 text-left shadow max-w-max bg-slate-300 p-4">
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
              className="mt-6 text-xl"
              onClick={() => updateProfile({ username, quote, avatar_url, setLoading, notify })}
              disabled={loading}
              aria-label='Update Profile'
            >
              {loading ? 'Loading ...' : <p className='button-secondary'>Save</p>}
            </button>
          </div>
        </div>

        <AddToHomeScreen />
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
