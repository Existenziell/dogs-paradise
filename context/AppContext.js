import { useState } from "react"
import { createContext, useContext, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import getProfile from "../lib/getProfile"
import getUserDogs from "../lib/getUserDogs"

const AppContext = createContext()
const useApp = () => useContext(AppContext)

export const AppWrapper = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(false)
  const [darkmode, setDarkmode] = useState(null)
  const [notificationMsg, setNotificationMsg] = useState('')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [userDogs, setUserDogs] = useState(null)

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
    if (!user?.username) {
      setShowOnboarding(true)
    } else {
      setShowOnboarding(false)
    }

    const userDogs = await getUserDogs()
    setUserDogs(userDogs)
    setCurrentUser(user)
  }

  useEffect(() => {
    setUser()
  }, [session])

  const notify = (msg) => {
    const notification = document.querySelector('.notification')
    notification.classList.remove('-translate-y-20')
    setNotificationMsg(msg)
    setTimeout(() => {
      notification.classList.add('-translate-y-20')
    }, 3500)
  }

  let contextValue = {
    currentUser,
    session,
    loading,
    darkmode,
    notificationMsg,
    showOnboarding,
    userDogs,
    setCurrentUser,
    setSession,
    setLoading,
    setDarkmode,
    setNotificationMsg,
    setShowOnboarding,
    setUserDogs,

    notify
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export default useApp
