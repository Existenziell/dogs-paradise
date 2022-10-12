import NextNprogress from 'nextjs-progressbar'
import DarkModeToggle from './DarkModeToggle'
import Notification from './Notification'
import Nav from './Nav'
import useApp from '../context/AppContext'
import Link from 'next/link'
import { UserGroupIcon } from '@heroicons/react/outline'

const Layout = ({ children }) => {
  const { currentUser } = useApp()
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
          {(currentUser?.role === 1 || currentUser?.role === 2) &&
            <Link href='/admin/dashboard'>
              <a className='hover:text-brand' title='Dashboard'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                  className="w-6 text-slate-600 dark:text-slate-300 dark:hover:text-brand hover:text-brand hover:scale-[103%]">
                  <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zm9.586 4.594a.75.75 0 00-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.116-.062l3-3.75z" clipRule="evenodd" />
                </svg>
              </a>
            </Link>
          }
          {currentUser?.role === 1 &&
            <Link href='/admin/dogs'>
              <a className='hover:text-brand' title='Admin'>
                <UserGroupIcon className='w-6 text-slate-600 dark:text-slate-300 dark:hover:text-brand hover:text-brand hover:scale-[103%]' />
              </a>
            </Link>
          }
        </div>
      </div>
    </>
  )
}

export default Layout
