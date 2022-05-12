import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import LoginBtn from './LoginBtn'
import LogoutBtn from './LogoutBtn'

import Footer from './Footer'
import Nav from './Nav'
import NextNprogress from 'nextjs-progressbar'
import DarkModeToggle from './DarkModeToggle'
import StickyHeader from './StickyHeader'
import ControlPanel from './ControlPanel'

const Layout = ({ children }) => {
  const router = useRouter()

  const [session, setSession] = useState(null)
  useEffect(() => {
    setSession(supabase.auth.session())
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <>
      <StickyHeader wrappedContent={
        <>
          <NextNprogress
            height={3}
            startPosition={0.3}
            stopDelayMs={100}
            showOnShallow={true}
            color='var(--color-brand)'
            options={{ showSpinner: false }}
          />
          <div className='flex justify-between z-20'>
            <Nav />
            <ControlPanel
              contents={
                <>
                  {session && <LogoutBtn />}
                  <DarkModeToggle />
                  <LoginBtn />
                </>
              }
            />
          </div>
        </>
      } />

      <main className='w-full text-center bg-cloth-pattern bg-repeat dark:bg-none dark:bg-brand-dark dark:text-gray-300 min-h-screen'>
        {children}
      </main>

      {router.pathname != '/map' &&
        <Footer />
      }
    </>
  )
}

export default Layout
