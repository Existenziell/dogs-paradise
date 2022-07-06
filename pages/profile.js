import { useEffect, useState } from 'react'
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
import useApp from '../context/AppContext'
import { getPublicUrl } from '../lib/supabase/getPublicUrl'
import { CheckCircleIcon } from '@heroicons/react/outline'

const Profile = ({ i18n }) => {
  const { session, currentUser, notify, userDogs, showOnboarding } = useApp()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState(null)
  const [email, setEmail] = useState(null)
  const [role, setRole] = useState(null)
  const [quote, setQuote] = useState(null)
  const [is_premium, setIsPremium] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)
  const [showEdit, setShowEdit] = useState(false)
  const [dogs, setDogs] = useState(null)

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username)
      setEmail(currentUser.email)
      setRole(currentUser.role)
      setQuote(currentUser.quote)
      setAvatarUrl(currentUser.avatar_url)
      setCreatedAt(currentUser.created_at)
      setIsPremium(currentUser.is_premium)
    }
  }, [currentUser])

  const enrichDog = async () => {
    for (let dog of userDogs) {
      // Download and set image
      let url
      if (dog.avatar_url) url = await getPublicUrl('dogs', dog.avatar_url)
      dog.public_url = url

      // Check fullyVaccinated status
      let checkVaccine = true
      for (let v of dog.status_vaccine) {
        if (v.status === 'false') checkVaccine = false
      }
      dog.fullyVaccinated = checkVaccine

      // Check fullyDewormed status
      let checkDewormed = true
      for (let d of dog.status_deworming) {
        if (d.status === 'false') checkDewormed = false
      }
      dog.fullyDewormed = checkDewormed
    }
    setDogs(userDogs)
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (userDogs) enrichDog()
  }, [userDogs])
  /* eslint-enable react-hooks/exhaustive-deps */

  const handleEdit = async () => {
    await updateProfile({ username, quote, avatar_url, setLoading, notify })
    setShowEdit(false)
  }

  if (!session || !currentUser) return <Auth />

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>

      <Header content={i18n.T1} />

      <div className='px-8 profile py-24'>
        <div className='p-4 md:p-8 mx-auto mb-16'>

          {showOnboarding ?
            <Onboarding />
            :
            <>
              <div className='flex flex-row flex-wrap justify-center md:justify-between items-start gap-4'>
                <div className='max-w-xs'>
                  <Avatar
                    bucket='avatars'
                    url={avatar_url}
                    // size={150}
                    onUpload={(url) => {
                      setAvatarUrl(url)
                      updateProfile({ username, email, role, quote, avatar_url: url, setLoading, notify })
                    }}
                  />
                </div>

                {/* <h2 className='text-2xl text-left mt-16 mb-4'>My Dogs:</h2> */}
                <div className='flex flex-wrap justify-start items-center gap-16 mt-8 md:mt-0'>
                  {dogs &&
                    dogs.map(d => (
                      <div key={d.id} className='flex flex-col items-center justify-center'>
                        <Link href={`dogs/${d.id}`}>
                          <a className='w-20 h-20 cursor-pointer hover:scale-105 transition-all relative'>
                            <img src={d.public_url ? d.public_url : '/icons/paw-turquoise.webp'} alt='Dog Image' className={d.public_url ? `shadow-sm rounded-sm` : ``} />
                            {d.fullyVaccinated && <div title="Fully Vaccinated!"><CheckCircleIcon className='w-6 absolute -top-8 right-6 text-brand' /></div>}
                            {d.fullyDewormed && <div title="Fully Dewormed!"><CheckCircleIcon className='w-6 absolute -top-8 right-0 text-brand' /></div>}
                          </a>
                        </Link>
                        <Link href={`dogs/${d.id}`}>
                          <a className='mt-2'>
                            {d.name}
                          </a>
                        </Link>
                      </div>
                    ))
                  }

                  <Link href={`dogs/add/`}>
                    <a className='flex flex-col items-center'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand hover:scale-105 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Add Dog</span>
                    </a>
                  </Link>
                </div>

                {!showEdit ?
                  <div className='flex flex-col items-center justify-center gap-4'>
                    <div className='md:text-right max-w-max mt-8 md:mt-0'>
                      <p className='text-2xl md:text-4xl whitespace-nowrap'>{username}</p>
                      <p className='text-xs'>{quote}</p>
                    </div>
                    <div className='md:text-right text-sm mb-2'>
                      <p className='text-sm'>Joined: {createdAt?.slice(0, 10)}</p>
                      <p>Member status: {is_premium ? `Premium` : `Free`}</p>
                    </div>
                    <button className='link text-xs w-max mx-auto' onClick={() => setShowEdit(true)}>Edit</button>

                    <h2 className='md:text-2xl text-left mt-8 md:mb-4'>Appointments:</h2>
                    <Link href='/appointments'><a className='button-secondary flex w-max'>View appointments</a></Link>

                  </div>
                  :
                  <div className="text-left shadow max-w-max bg-white dark:bg-dark dark:text-white px-5 py-3 rounded">
                    <div>
                      <label htmlFor="username" className='block text-xs mt-2'>Username</label>
                      <input
                        id="username"
                        type="text"
                        value={username || ''}
                        onChange={(e) => setUsername(e.target.value)}
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
                        className="mt-6 text-xl button-secondary"
                        onClick={handleEdit}
                        disabled={loading}
                        aria-label='Update Profile'
                      >
                        {loading ? 'Loading ...' : 'Save'}
                      </button>
                      <button onClick={() => setShowEdit(false)} className='text-xs ml-4'>Cancel</button>
                    </div>
                  </div>
                }
              </div>

              {currentUser.role === 1 &&
                <div className='mt-12'>
                  <p className='mb-4'>App Administration:</p>
                  <Link href='/admin/dogs'><a className='button button-secondary mr-2'>Dogs</a></Link>
                  <Link href='/admin/users'><a className='button button-secondary mr-2'>Users</a></Link>
                  <Link href='/admin/appointments'><a className='button button-secondary'>Appointments</a></Link>
                </div>
              }
            </>
          }
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
