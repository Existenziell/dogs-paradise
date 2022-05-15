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

const Home = ({ i18n }) => {
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

  if (!session) return <Auth />

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>

      <div className='px-8 profile pb-24'>
        <div className='p-4 md:p-8 mx-auto rounded-xl text-white bg-gradient-to-tl from-primary to-secondary shadow-xl overflow-hidden'>

          {appCtx.showOnboarding ?
            <Onboarding />
            :
            <div className='flex flex-row justify-between gap-4'>
              <div className='w-1/3'>
                <Avatar
                  url={avatar_url}
                  size={150}
                  onUpload={(url) => {
                    setAvatarUrl(url)
                    updateProfile({ username, email, role, quote, avatar_url: url, setLoading, notify })
                  }}
                />
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

        <h2 className='mb-2 mt-8 text-xl'>Available Services:</h2>
        <div className='text-brand-dark gap-2 flex items-center justify-center mb-8'>
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

        <AddToHomeScreen />
      </div>
    </>
  )
}

export async function getStaticProps(context) {
  let i18n
  context.locale === 'en' ?
    i18n = langEN.home :
    i18n = langES.home
  return {
    props: { i18n },
  }
}

export default Home
