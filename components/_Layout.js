import { useRouter } from 'next/router'
import NextNprogress from 'nextjs-progressbar'
import Footer from './Footer'
import Nav from './Nav'
import DarkModeToggle from './DarkModeToggle'
import { useEffect } from 'react'
import { sticky } from '../lib/StickyHeader'

const Layout = ({ children }) => {
  const router = useRouter()
  useEffect(() => {
    sticky()
  }, [])

  return (
    <>
      <header className="page-header z-20 absolute">
        <div className="trigger-menu-wrapper pb-3">
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
            <DarkModeToggle />
          </div>
        </div>
      </header>

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
