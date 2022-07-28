import NextNprogress from 'nextjs-progressbar'
import DarkModeToggle from './DarkModeToggle'
import Notification from './Notification'
import LogoutBtn from './LogoutBtn'
import Nav from './Nav'
import useApp from '../context/AppContext'
import Link from 'next/link'
import { UserGroupIcon } from '@heroicons/react/outline'

const Layout = ({ children }) => {
  const { session, currentUser } = useApp()

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

      <main className='w-full text-center bg-cloth-pattern bg-repeat dark:bg-none dark:bg-dark dark:text-slate-200 min-h-screen'>
        {children}
      </main>

      <div className='w-full fixed z-20 top-4 right-0 left-0 flex items-center justify-between px-4 md:px-8 '>
        <DarkModeToggle />
        <div className='flex items-center gap-4'>
          {currentUser?.role === 1 &&
            <Link href='/admin/dogs'>
              <a className='hover:text-brand'>
                <UserGroupIcon className='w-6 text-slate-600 dark:text-slate-300 dark:hover:text-brand hover:text-brand hover:scale-[103%]' />
              </a>
            </Link>
          }
          {session && <LogoutBtn />}
        </div>
      </div>

    </>
  )
}

export default Layout
