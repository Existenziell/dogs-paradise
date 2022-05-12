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

  const toggleControlPanel = (e) => {
    e.preventDefault()
    const panel = document.getElementsByClassName('controlPanel')[0]
    panel.classList.toggle('-translate-y-16')
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
              <div className='controlPanel flex items-center gap-4 -translate-y-16  transition-all duration-300'>
                <LogoutBtn />
                <DarkModeToggle />
              </div>
              <div onClick={toggleControlPanel}>
                <LoginBtn />
              </div>
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
