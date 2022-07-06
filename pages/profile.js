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
  const [view, setView] = useState('info')

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
            <div className='flex flex-col md:flex-row justify-center items-start gap-10 md:gap-20'>
              <div className='md:max-w-2xl'>
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

              <div className='w-full'>
                <div className='mb-20 w-full'>
                  <ul className='text-lg md:text-2xl flex justify-evenly md:justify-start gap-8 md:gap-20'>
                    <li className={view === 'info' ? `border-b-2 border-brand` : `hover:text-brand`}>
                      <button onClick={(e) => setView(e.target.name)} name='info'>
                        Info
                      </button>
                    </li>
                    <li className={view === 'dogs' ? `border-b-2 border-brand` : `hover:text-brand`}>
                      <button onClick={(e) => setView(e.target.name)} name='dogs'>
                        Dogs
                      </button>
                    </li>
                    <li className={view === 'appointments' ? `border-b-2 border-brand` : `hover:text-brand`}>
                      <button onClick={(e) => setView(e.target.name)} name='appointments'>
                        Appointments
                      </button>
                    </li>
                    {currentUser.role === 1 &&
                      <li className={view === 'admin' ? `border-b-2 border-brand` : `hover:text-brand`}>
                        <button onClick={(e) => setView(e.target.name)} name='admin'>
                          Admin
                        </button>
                      </li>
                    }
                  </ul>
                </div>

                {view === 'info' &&
                  <>
                    {!showEdit ?
                      <div className='flex flex-col items-center md:items-start justify-center md:justify-start md:text-left gap-4'>
                        <p className='text-2xl md:text-4xl whitespace-nowrap mb-4'>{username}</p>
                        <div className='flex flex-col gap-1 mb-2'>
                          <p>{quote}</p>
                          <p>Joined: {createdAt?.slice(0, 10)}</p>
                          <p>Member status: {is_premium ? `Premium` : `Free`}</p>
                        </div>
                        <button className='link' onClick={() => setShowEdit(true)}>Edit</button>
                      </div>
                      :
                      <div className="text-left shadow max-w-max mx-auto md:mx-0 bg-white dark:bg-dark dark:text-white px-5 py-3 rounded-sm">
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
                  </>
                }

                {view === 'dogs' &&
                  <div className='flex flex-wrap justify-center md:justify-start items-center w-full gap-16'>
                    {dogs &&
                      dogs.map(d => (
                        <div key={d.id} className='flex flex-col items-center justify-center'>
                          <Link href={`dogs/${d.id}`}>
                            <a className='w-20 h-20 cursor-pointer hover:scale-105 transition-all relative'>
                              <img src={d.public_url ? d.public_url : '/icons/paw-turquoise.webp'} alt='Dog Image' className={d.public_url ? `shadow-sm rounded-sm` : ``} />
                              {d.fullyVaccinated && <div title="Fully Vaccinated!"><CheckCircleIcon className='w-6 absolute -top-7 right-6 text-brand' /></div>}
                              {d.fullyDewormed && <div title="Fully Dewormed!"><CheckCircleIcon className='w-6 absolute -top-7 right-0 text-brand' /></div>}
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
                }

                {view === 'appointments' &&
                  <div className='flex flex-col gap-4 items-center md:items-start justify-center md:justify-start'>
                    <Link href='/appointments'><a className='button-secondary w-52'>View appointments</a></Link>
                    <Link href='/appointments/create'><a className='button-secondary w-52'>Create appointment</a></Link>
                  </div>
                }


                {currentUser.role === 1 && view === 'admin' &&
                  <div className='mt-12 flex gap-4 items-center md:items-start justify-center md:justify-start'>
                    <Link href='/admin/dogs'><a className='button button-secondary mr-2'>Dogs</a></Link>
                    <Link href='/admin/users'><a className='button button-secondary mr-2'>Users</a></Link>
                    <Link href='/admin/appointments'><a className='button button-secondary'>Appointments</a></Link>
                  </div>
                }

              </div>
            </div>
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
