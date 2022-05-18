import { useState } from "react"
import { createContext, useContext, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import getProfile from "../lib/getProfile"

const AppContext = createContext({})

const AppWrapper = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(false)
  const [darkmode, setDarkmode] = useState(null)
  const [notificationMsg, setNotificationMsg] = useState('')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [userPets, setUserPets] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.session())
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const setUser = async () => {
    const authUser = supabase.auth.user()
    if (!authUser) return

    const user = await getProfile(() => { })
    if (!user.username || !user.avatar_url) {
      setShowOnboarding(true)
    } else {
      setShowOnboarding(false)
    }
    setCurrentUser(user)
  }

  useEffect(() => {
    setUser()
  }, [session])

  useEffect(() => {
    if (currentUser) {
      setUserPets(currentUser.dogs)
    }
  }, [currentUser])

  const notify = (msg) => {
    const notification = document.querySelector('.notification')
    notification.classList.remove('-translate-y-20')
    setNotificationMsg(msg)
    setTimeout(() => {
      notification.classList.add('-translate-y-20')
    }, 3500)
  }

  let app = {
    currentUser,
    session,
    loading,
    darkmode,
    notificationMsg,
    showOnboarding,
    userPets,
    setCurrentUser,
    setSession,
    setLoading,
    setDarkmode,
    setNotificationMsg,
    setShowOnboarding,
    setUserPets,

    notify
  }

  return (
    <AppContext.Provider value={app}>
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppWrapper, useAppContext }
