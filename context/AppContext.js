import React, { useState } from "react"
import { createContext, useContext } from 'react'

const AppContext = createContext({})

const AppWrapper = ({ children }) => {

  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState(null)

  const [currentUser, setCurrentUser] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [profileCreated, setProfileCreated] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showControlPanel, setShowControlPanel] = useState(false)

  const toggleControlPanel = (e) => {
    e.preventDefault()
    const trigger = document.getElementsByClassName('controlPanelTrigger')[0]
    const panel = document.getElementsByClassName('controlPanel')[0]

    panel.classList.toggle('-translate-y-16')
    trigger.classList.add('animate-ping')
    setTimeout(() => {
      trigger.classList.remove('animate-ping')
    }, 400)
    setShowControlPanel(!showControlPanel)
  }

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

  let app = {
    loading,
    theme,
    showControlPanel,
    setLoading,
    setTheme,
    setShowControlPanel,
    toggleControlPanel,
  }

  return (
    <AppContext.Provider value={{ user, app }}>
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppWrapper, useAppContext }
