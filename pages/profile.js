/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { getPublicUrl } from '../lib/supabase/getPublicUrl'
import { ChevronDoubleRightIcon } from '@heroicons/react/outline'
import { PulseLoader } from 'react-spinners'
import { services } from '../lib/services'
import Head from 'next/head'
import Link from 'next/link'
import Auth from '../components/Auth'
// import Avatar from '../components/Avatar'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'
import Header from '../components/Header'
import useApp from '../context/AppContext'
import Onboarding from '../components/Onboarding'
import AddToHomeScreen from '../components/AddToHomeScreen'
import updateProfile from '../lib/updateProfile'
import getAppointments from '../lib/getAppointments'
import LogoutBtn from '../components/LogoutBtn'

const Profile = ({ i18n }) => {
  const { session, currentUser, notify, userDogs, showOnboarding } = useApp()
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState(null)
  // const [email, setEmail] = useState(null)
  // const [role, setRole] = useState(null)
  const [quote, setQuote] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)
  const [showEdit, setShowEdit] = useState(false)
  const [dogs, setDogs] = useState(null)
  const [view, setView] = useState('dogs')
  const [appointments, setAppointments] = useState(null)

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username)
      // setEmail(currentUser.email)
      // setRole(currentUser.role)
      setQuote(currentUser.quote)
      setAvatarUrl(currentUser.avatar_url)
      setCreatedAt(currentUser.created_at)
      fetchAppointments(currentUser.id)
    }
  }, [currentUser])

  const fetchAppointments = async (id) => {
    const appointments = await getAppointments(id)
    for (const a of appointments) {
      const name = getServiceName(a.type)
      a.type = name
    }
    setFetching(false)
    setAppointments(appointments)
  }

  const enrichDog = async () => {
    for (const dog of userDogs) {
      // Download and set image
      let url
      if (dog.avatar_url) url = await getPublicUrl('dogs', dog.avatar_url)
      dog.public_url = url
      // Set the ok attribute for signaling clearly if dog is ok to enter facilities
      dog.ok = false
      if (dog.fully_dewormed && dog.fully_vaccinated) dog.ok = true
    }
    setDogs(userDogs)
  }

  useEffect(() => {
    if (userDogs) enrichDog()
  }, [userDogs])

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
              {/* <div className='md:w-1/2'>
                <Avatar
                  bucket='avatars'
                  url={avatar_url}
                  // size={150}
                  onUpload={(url) => {
                    setAvatarUrl(url)
                    updateProfile({ username, email, role, quote, avatar_url: url, setLoading, notify })
                  }}
                />
              </div> */}

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
                {currentUser.role === 1 &&
                  <li className={view === 'admin' ? `border-b-2 border-brand` : `hover:text-brand`}>
                    <Link href='/admin/dogs'>
                      <a>
                        Admin
                      </a>
                    </Link>
                  </li>
                }
                {(currentUser?.role === 1 || currentUser?.role === 2) &&
                  <li className={view === 'admin' ? `border-b-2 border-brand` : `hover:text-brand`}>
                    <Link href='/admin/dashboard'>
                      <a className='hover:text-brand'>
                        Dashboard
                      </a>
                    </Link>
                  </li>
                }
              </ul>

              <div className='w-full'>
                {view === 'dogs' &&
                  <div className='flex flex-wrap justify-center items-center w-full gap-16'>
                    {dogs &&
                      dogs.map(d => (
                        <div key={d.id} className='flex flex-col items-center justify-center'>
                          <Link href={`dogs/${d.id}`}>
                            <a className={`${d.ok ? `border-green-600` : `border-red-600`} border-8 rounded-full flex items-center w-36 h-36 md:w-44 md:h-44 cursor-pointer hover:scale-[101%] transition-all relative`}>
                              <img
                                src={d.public_url ? d.public_url : '/icons/paw-turquoise.webp'}
                                alt='Dog Image'
                                className={d.public_url ? `shadow-sm rounded-full aspect-square bg-contain` : `w-24 h-24 md:w-32 md:h-32 mx-auto`} />

                              {/* {d.fully_vaccinated ?
                                <div title="Fully Vaccinated!"><CheckCircleIcon className='w-6 absolute -top-7 right-6 text-brand' /></div>
                                :
                                <div title="Not Vaccinated!"><XIcon className='w-6 absolute -top-7 right-6 text-red-700' /></div>
                              }
                              {d.fully_dewormed ?
                                <div title="Fully Dewormed!"><CheckCircleIcon className='w-6 absolute -top-7 right-0 text-brand' /></div>
                                :
                                <div title="Not Dewormed!"><XIcon className='w-6 absolute -top-7 right-0 text-red-700' /></div>
                              } */}
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand hover:scale-105 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Dog</span>
                      </a>
                    </Link>
                  </div>
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
                      <div className="text-left shadow w-full md:max-w-max mx-auto md:mx-0 overflow-hidden bg-white dark:bg-dark dark:text-white px-5 py-3 rounded-sm">
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
                  <div className='flex flex-col gap-8 md:gap-4 items-start justify-center max-w-max mx-auto'>
                    <div className='flex justify-between items-center w-full mb-2'>
                      <h2>These are all your appointments:</h2>
                      <Link href='/appointments/create'><a className='button button-sm'>New Appointment</a></Link>
                    </div>
                    {appointments?.map(a => (
                      <div key={a.id}>
                        <Link href={`/appointments`}>
                          <a className='text-xs text-left block hover:text-brand'>
                            {/* <ChevronDoubleRightIcon className='w-5 relative bottom-1 inline-block mx-2' /> */}
                            <span className='text-xl'>{a.date}</span>
                            <span className='px-2'>at</span>
                            <span className='text-xl'>{(a.time).replace(' ', '')}</span>
                            <ChevronDoubleRightIcon className='w-3 inline-block mx-2' />
                            <span className='text-xl'>{a.type}</span>
                            <span className='px-2'>for/with</span>
                            <span className='text-xl'>{a.dogs.name}</span>
                          </a>
                        </Link>
                      </div>
                    ))}
                  </div>
                }
              </div>
            </div>
          }
          <Link href='/contact'><a className='button button-sm mt-20 block max-w-max mx-auto'>Contact Us</a></Link>
          {session && (
            <div className='flex items-center justify-center mt-4'>
              <LogoutBtn />
            </div>
          )}
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
