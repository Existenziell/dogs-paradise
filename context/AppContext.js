import React, { useState } from "react"
import { createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'

const AppContext = createContext({})

const AppWrapper = ({ children }) => {

  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState(null)

  const [currentUser, setCurrentUser] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [profileCreated, setProfileCreated] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  let user = {
    currentUser,
    loggedIn,
    profileCreated,
    showOnboarding,
    setCurrentUser,
    setLoggedIn,
    setProfileCreated,
    setShowOnboarding,
  }

  let appState = {
    loading,
    theme,
    setLoading,
    setTheme,
  }

  return (
    <AppContext.Provider value={{ user, appState }}>
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppWrapper, useAppContext }
