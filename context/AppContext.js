import React, { useState } from "react"
import { createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'

const AppContext = createContext({})

const AppWrapper = ({ children }) => {

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [theme, setTheme] = useState(null)

  const [loggedInUser, setLoggedInUser] = useState(null)
  // const [session, setSession] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)

  const [username, setUsername] = useState(null)
  const [quote, setQuote] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [finalAvatarUrl, setFinalAvatarUrl] = useState(null)
  const [profileCreated, setProfileCreated] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  async function setSession() {
    // setSession(supabase.auth.session())

    // supabase.auth.onAuthStateChange((_event, session) => {
    //   setSession(session)
    // })
  }

  async function getProfile() {
    try {
      const user = supabase.auth.user()
      if (!user) {
        setLoading(false)
        return
      }

      setLoading(true)
      setLoggedInUser(user)

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, quote, avatar_url, created_at`)
        .eq('id', user.id)
        .single()

      console.log("getProfile:", user.id, data);

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setQuote(data.quote)
        setAvatarUrl(data.avatar_url)
        setCreatedAt(data.created_at)
      } else {
        setShowOnboarding(true)
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({ username, quote, avatarUrl }) {
    console.log("updateProfile", username, quote, avatarUrl);
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const updates = {
        id: user.id,
        username,
        quote,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      }
      console.log("Updated data:", updates);

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

  async function uploadImage(event, bucket) {

    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }
      console.log("uploadImage: ", bucket, filePath);

      setAvatarUrl(filePath)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
      // return filePath
    }
  }

  async function downloadImage(bucket, url) {
    console.log("downloadImage: ", bucket, url);

    try {
      const { data, error } = await supabase.storage.from(bucket).download(url)
      if (error) {
        throw error
      }
      const createdUrl = URL.createObjectURL(data)
      console.log("FINAL URL: ", createdUrl);
      setAvatarUrl(createdUrl)
      setFinalAvatarUrl(createdUrl)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }


  let user = {
    username,
    quote,
    avatarUrl,
    finalAvatarUrl,
    loggedIn,
    profileCreated,
    showOnboarding,
    setUsername,
    setQuote,
    setAvatarUrl,
    setFinalAvatarUrl,
    setLoggedIn,
    setProfileCreated,
    setShowOnboarding,
    getProfile,
    updateProfile,
    downloadImage,
    uploadImage
  }

  let appState = {
    loading,
    uploading,
    theme,
    loggedInUser,
    setLoading,
    setUploading,
    setTheme,
    setLoggedInUser,
    setSession
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
