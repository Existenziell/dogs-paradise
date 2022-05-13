import React, { useState } from "react"
import { createContext, useContext } from 'react'

const AppContext = createContext({})

const AppWrapper = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState(null)
  const [showControlPanel, setShowControlPanel] = useState(false)
  const [notificationMsg, setNotificationMsg] = useState('')

  const [currentUser, setCurrentUser] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [profileCreated, setProfileCreated] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

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

  const notify = (msg) => {
    const notification = document.querySelector('.notification')
    notification.classList.remove('-translate-y-20')
    setNotificationMsg(msg)
    setTimeout(() => {
      notification.classList.add('-translate-y-20')
    }, 3500)
  }

  let app = {
    loading,
    theme,
    notificationMsg,
    showControlPanel,
    setLoading,
    setTheme,
    setShowControlPanel,
    setNotificationMsg,

    toggleControlPanel,
    notify
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
