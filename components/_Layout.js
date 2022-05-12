import { useState } from 'react'
import { useRouter } from 'next/router'
import LoginBtn from './LoginBtn'
import LogoutBtn from './LogoutBtn'

import Footer from './Footer'
import Nav from './Nav'
import NextNprogress from 'nextjs-progressbar'
import DarkModeToggle from './DarkModeToggle'
import StickyHeader from './StickyHeader'

const Layout = ({ children }) => {
  const router = useRouter()

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
            <div className='flex'>
              <div className='controlPanel flex items-center gap-4 -translate-y-16 transition-all duration-300' >
                <LogoutBtn />
                <DarkModeToggle />
                <LoginBtn />
              </div>
              <button onClick={toggleControlPanel} className='mr-2 ml-4 controlPanelTrigger'>
                {showControlPanel ?
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand hover:text-slate-400 hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
                  </svg>
                  :
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand hover:text-slate-400 hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                  </svg>
                }
              </button>
            </div>
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
