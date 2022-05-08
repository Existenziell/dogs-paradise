import { useRouter } from 'next/router'
import { LoginBtn } from './LoginBtn'
import NextNprogress from 'nextjs-progressbar'
import Footer from './Footer'
import Nav from './Nav'
import DarkModeToggle from './DarkModeToggle'
import StickyHeader from './StickyHeader'

const Layout = ({ children }) => {

  const router = useRouter()

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
            <div className='flex items-center justify-center'>
              <DarkModeToggle />
              <LoginBtn />
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
