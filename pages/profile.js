import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Auth from '../components/Auth'
import UserProfile from '../components/UserProfile'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'

const Profile = ({ i18n }) => {

  const [session, setSession] = useState(null)
  useEffect(() => {
    setSession(supabase.auth.session())
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <>
      {!session ?
        <Auth />
        :
        <UserProfile key={session.user.id} session={session} i18n={i18n} />
      }
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
