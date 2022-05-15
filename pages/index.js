import { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import Head from 'next/head'
import Auth from '../components/Auth'
import Home from '../components/Home'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'

const Paradise = ({ i18n }) => {
  const appCtx = useContext(AppContext)
  const { session, notify, currentUser } = appCtx

  const [loading, setLoading] = useState(true)

  if (!session) return <Auth />

  return (
    <Home i18n={i18n} />
  )
}

export async function getStaticProps(context) {
  let i18n
  context.locale === 'en' ?
    i18n = langEN.home :
    i18n = langES.home
  return {
    props: { i18n },
  }
}

export default Paradise
