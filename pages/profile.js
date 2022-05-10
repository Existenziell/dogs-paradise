import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { LogoutBtn } from '../components/LogoutBtn'
import Head from 'next/head'
import PacmanLoader from 'react-spinners/PacmanLoader'
import Avatar from '../components/Avatar'
import Auth from '../components/Auth'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'

const Profile = ({ i18n }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    getProfile()
  }, [session])

  async function getProfile() {
    try {
      const user = supabase.auth.user()
      if (!user) {
        setLoading(false)
        return
      }

      setLoading(true)
      setUser(user)
      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url, created_at`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
        setCreatedAt(data.created_at)
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <Auth />
  if (loading) return <div className='pt-32'><PacmanLoader color={'var(--color-brand)'} size={30} /></div>

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>

      <LogoutBtn />

      <div className='pt-24 px-8 profile'>
        <h1 className='text-6xl mb-12'>{i18n.T1}</h1>
        <h2 className='text-left mb-2'>Your Membership Card:</h2>

        <div className='p-4 md:p-8 mx-auto rounded-xl text-white bg-gradient-to-tl from-primary to-secondary shadow-xl overflow-hidden'>
          <div className='flex flex-row justify-between gap-4'>
            <div className='w-1/3'>
              <Avatar
                url={avatar_url}
                onUpload={(url) => {
                  setAvatarUrl(url)
                  updateProfile({ username, website, avatar_url: url })
                }}
              />
            </div>
            <div className='flex flex-col h-full gap-4'>
              <div className='text-right  bg-white/10 backdrop-blur-md p-4 rounded-xl max-w-max self-end'>
                <p className='text-2xl md:text-4xl'>{username}</p>
                <p className='text-xs'>{website}</p>
              </div>
              <div className='text-right text-sm'>
                <p className='text-sm'>Joined: {createdAt.slice(0, 10)}</p>
                <p>Member status: Free</p>
              </div>

              <div className='flex justify-end gap-4'>
                <img src='/img/dogs/dog1.jpg' alt='Dog1' className='rounded-full w-16 shadow-lg border-2 border-white cursor-pointer' />
                <img src='/img/dogs/dog2.jpg' alt='Dog2' className='rounded-full w-16 shadow-lg border-2 border-white cursor-pointer' />
              </div>
            </div>
          </div>
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
            <label htmlFor="website" className='block text-xs'>Website</label>
            <input
              id="website"
              type="website"
              value={website || ''}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div>
            <button
              className="link mt-2"
              onClick={() => updateProfile({ username, website, avatar_url })}
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
