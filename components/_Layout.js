import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useRouter } from 'next/router'
import { urls } from '../lib/config'
import NextNprogress from 'nextjs-progressbar'
import DarkModeToggle from './DarkModeToggle'
import Notification from './Notification'
import Nav from './Nav'
import LogoutBtn from './LogoutBtn'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'

const Layout = ({ children }) => {
  const appCtx = useContext(AppContext)
  const { session } = appCtx
  const { locale } = useRouter()
  const router = useRouter()

  let i18n
  locale === 'es' ?
    i18n = langES.navigation :
    i18n = langEN.navigation

  const headerIdentifier = urls.filter(u => u.url === router.pathname)[0]?.name

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

      {session && <Nav />}

      <main className='w-full text-center bg-cloth-pattern bg-repeat dark:bg-none dark:bg-brand-dark dark:text-gray-300 min-h-screen'>

        {headerIdentifier &&
          <header className='text-4xl md:text-6xl mb-12 py-3 bg-slate-100 shadow text-slate-600 dark:bg-slate-600 dark:text-slate-300'>
            {i18n[headerIdentifier]}
          </header>
        }

        {children}
      </main>

      {router.pathname === '/profile' &&
        <div className='absolute bottom-20 right-6 flex items-center justify-center gap-4'>
          <LogoutBtn />
          <DarkModeToggle />
        </div>

      }
    </>
  )
}

export default Layout
