import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { variants } from '../lib/config'
import NextNprogress from 'nextjs-progressbar'
import DarkModeToggle from './DarkModeToggle'
import Notification from './Notification'
import LogoutBtn from './LogoutBtn'
import Nav from './Nav'

const Layout = ({ children }) => {
  const appCtx = useContext(AppContext)
  const { session } = appCtx
  const router = useRouter()

  return (
    <>
      <Notification />

      <NextNprogress
        height={3}
        startPosition={0.3}
        stopDelayMs={100}
        showOnShallow={true}
        color='var(--color-brand)'
        options={{ showSpinner: false }}
      />

      <Nav />

      <motion.main
        key={router.route}
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ type: 'linear' }}
        className='w-full text-center bg-cloth-pattern bg-repeat dark:bg-none dark:bg-brand-dark dark:text-gray-300 min-h-screen'
      >

        {children}
      </motion.main>

      {session &&
        <div className='w-full absolute top-4 right-0 left-0 flex items-center justify-between px-4 '>
          <LogoutBtn />
          <DarkModeToggle />
        </div>
      }
    </>
  )
}

export default Layout
