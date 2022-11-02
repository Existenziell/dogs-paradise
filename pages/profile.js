import { useEffect, useState } from 'react'
import { ChevronDoubleRightIcon } from '@heroicons/react/outline'
import { PulseLoader } from 'react-spinners'
import { services } from '../lib/services'
import Head from 'next/head'
import Link from 'next/link'
import Auth from '../components/Auth'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'
import Header from '../components/Header'
import useApp from '../context/AppContext'
import Onboarding from '../components/Onboarding'
import AddToHomeScreen from '../components/AddToHomeScreen'
import updateProfile from '../lib/updateProfile'
import getAppointments from '../lib/getAppointments'
import LogoutBtn from '../components/LogoutBtn'
import Image from 'next/image'

const Profile = ({ i18n }) => {
  const { session, currentUser, notify, userDogs, showOnboarding } = useApp()
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState(null)
  const [quote, setQuote] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)
  const [showEdit, setShowEdit] = useState(false)
  const [view, setView] = useState('dogs')
  const [appointments, setAppointments] = useState(null)

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username)
      setQuote(currentUser.quote)
      setAvatarUrl(currentUser.avatar_url)
      setCreatedAt(currentUser.created_at)
      fetchAppointments(currentUser.id)
    }
  }, [currentUser])
  /* eslint-enable react-hooks/exhaustive-deps */

  const fetchAppointments = async (id) => {
    const appointments = await getAppointments(id)
    for (const a of appointments) {
      const name = getServiceName(a.type)
      a.type = name
    }
    setFetching(false)
    setAppointments(appointments)
  }

  const handleEdit = async () => {
    await updateProfile({ username, quote, avatar_url, setLoading, notify })
    setShowEdit(false)
  }

  const getServiceName = (slug) => {
    return services.filter(s => (s.slug === slug)).at(0).title
  }

  if (!session) return <Auth />
  if (fetching) return <div className='flex items-center justify-center pt-[25%]'><PulseLoader color={'var(--color-brand)'} size={20} /></div>

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
            <div className='flex flex-col justify-center items-center gap-8 md:gap-16 w-full'>
              <ul className='md:text-2xl flex justify-evenly gap-4 md:gap-10'>
                <li className={view === 'dogs' ? `border-b-2 border-brand` : `hover:text-brand`}>
                  <button onClick={(e) => setView(e.target.name)} name='dogs'>
                    Dogs
                  </button>
                </li>
                <li className={view === 'info' ? `border-b-2 border-brand` : `hover:text-brand`}>
                  <button onClick={(e) => setView(e.target.name)} name='info'>
                    Info
                  </button>
                </li>
                <li className={view === 'appointments' ? `border-b-2 border-brand` : `hover:text-brand`}>
                  <button onClick={(e) => setView(e.target.name)} name='appointments'>
                    Appointments
                  </button>
                </li>
              </ul>

              <div className='w-full'>
                {view === 'dogs' &&
                  <>
                    <div className='flex flex-wrap justify-center items-center w-full gap-16 mb-8'>
                      {userDogs &&
                        userDogs.map(d => (
                          <div key={d.id} className='flex flex-col items-center justify-center'>
                            <Link href={`dogs/${d.id}`}>
                              <a className={`${(d.fully_dewormed && d.fully_vaccinated) ? `border-green-600` : `border-red-600`} border-8 rounded-full flex items-center w-36 h-36 md:w-44 md:h-44 cursor-pointer hover:scale-[101%] transition-all relative`}>
                                <Image
                                  src={d.avatar_url ? `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}dogs/${d.avatar_url}` : '/icons/paw-turquoise.webp'}
                                  alt='Dog Image'
                                  className={d.avatar_url ? `shadow-sm rounded-full aspect-square bg-contain` : `w-24 h-24 md:w-32 md:h-32 mx-auto`}
                                  width={200}
                                  height={200}
                                  placeholder='blur'
                                  blurDataURL={d.avatar_url ? `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}dogs/${d.avatar_url}` : '/icons/paw-turquoise.webp'}
                                />
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
                    </div>
                    <Link href={`dogs/add/`}>
                      <a className='flex flex-col items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand hover:scale-105 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Dog</span>
                      </a>
                    </Link>
                  </>
                }

                {view === 'info' &&
                  <>
                    {!showEdit ?
                      <div className='flex flex-col items-center justify-center gap-4'>
                        <p className='text-2xl md:text-4xl whitespace-nowrap mb-4'>{username}</p>
                        <div className='flex flex-col gap-1 mb-2'>
                          <p>{quote}</p>
                          <p>Joined: {createdAt?.slice(0, 10)}</p>
                        </div>
                        <button className='link' onClick={() => setShowEdit(true)}>Edit</button>
                      </div>
                      :
                      <div className="text-left shadow w-full md:max-w-max mx-auto overflow-hidden bg-white dark:bg-dark dark:text-white px-5 py-3 rounded-sm">
                        <div>
                          <label htmlFor="username" className='block text-xs mt-2'>Username</label>
                          <input
                            id="username"
                            type="text"
                            value={username || ''}
                            onChange={(e) => setUsername(e.target.value)}
                            className='w-full'
                          />
                        </div>
                        <div className='mt-2 w-full'>
                          <label htmlFor="quote" className='block text-xs mt-2'>Quote</label>
                          <input
                            id="quote"
                            type="text"
                            value={quote || ''}
                            onChange={(e) => setQuote(e.target.value)}
                            className='w-full'
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

                {view === 'appointments' &&
                  <div className='flex flex-col gap-1 items-start justify-center max-w-max mx-auto'>
                    <div className='flex justify-between items-center w-full text-left mb-6'>
                      <h2>These are all your appointments:</h2>
                      <Link href='/appointments/create'><a className='button button-sm whitespace-nowrap'>Create New</a></Link>
                    </div>
                    {appointments?.map(a => (
                      <div key={a.id} className='mb-2 text-sm md:text-base'>
                        <Link href={`/appointments`}>
                          <a className='text-xs text-left block hover:text-brand'>
                            <span className='text-base md:text-xl'>{a.date}</span>
                            <span className='px-2'>at</span>
                            <span className='text-base md:text-xl'>{(a.time).replace(' ', '')}</span>
                            <ChevronDoubleRightIcon className='w-3 inline-block mx-2' />
                            <span className='text-base md:text-xl'>{a.type}</span>
                            <span className='px-2'>for/with</span>
                            <span className='text-base md:text-xl'>{a.dogs.name}</span>
                          </a>
                        </Link>
                      </div>
                    ))}
                  </div>
                }
              </div>
            </div>
          }

          <div className='mt-20 flex flex-col gap-4'>
            <AddToHomeScreen />

            <Link href='/contact'><a className='button button-sm block max-w-max mx-auto'>Contact Us</a></Link>
            {session && (
              <div className='flex items-center justify-center'>
                <LogoutBtn />
              </div>
            )}
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
