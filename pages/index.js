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
import Header from '../components/Header'

const Home = ({ i18n }) => {
  const appCtx = useContext(AppContext)
  const { notify, currentUser, userPets } = appCtx

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

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>

      <Header content={i18n.T1} />

      <div className='px-8 profile py-24'>

        <video src='/video/promo.mp4' controls={false} loop={true} autoPlay={true} className='max-w-xs mx-auto mb-8 rounded-2xl shadow' />

        {/* <div className='p-4 md:p-8 mx-auto rounded-xl text-white bg-gradient-to-tl from-primary to-secondary shadow-xl overflow-hidden'> */}

        {/* {appCtx.showOnboarding ?
            <Onboarding />
            :
            <>
              <div className='flex flex-row flex-wrap justify-between gap-4'>
                <div className='max-w-lg'>
                  <Avatar
                    url={avatar_url}
                    // size={150}
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
                  <div className='text-right text-sm mb-6'>
                    <p className='text-sm'>Joined: {createdAt?.slice(0, 10)}</p>
                    <p>Member status: {is_premium ? `Premium` : `Free`}</p>
                  </div>
                </div>
              </div>

              <div className='flex flex-wrap justify-evenly items-center gap-4 mt-8'>
                {userPets?.length &&
                  userPets.map(d => (
                    <div key={d.id} className='flex flex-col items-center justify-center'>
                      <Link href={`pets/${d.id}`}>
                        <a className='w-12 h-12 cursor-pointer hover:scale-105 transition-all'>
                          <img src='/icons/paw-white.png' alt='Paw' />
                        </a>
                      </Link>
                      <Link href={`pets/${d.id}`}>
                        <a className='mt-2'>
                          {d.name}
                        </a>
                      </Link>
                    </div>
                  ))
                }
                <Link href={`pets/add/`}>
                  <a className='flex flex-col items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white hover:scale-105 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className=''>Add Pet</span>
                  </a>
                </Link>
              </div>
            </>
          } */}
      </div>

      {/* <h2 className='mb-2 mt-8 text-xl'>Available Services:</h2>
        <div className='text-brand-dark gap-4 flex items-center justify-center mb-8'>
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

        <AddToHomeScreen /> */}
      {/* </div> */}
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
