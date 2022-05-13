import { useState, useContext } from 'react'
import { supabase } from '../lib/supabase'
import { AppContext } from '../context/AppContext'
import Head from 'next/head'

const Auth = ({ i18n }) => {
  const ctx = useContext(AppContext)
  const appCtx = ctx.app

  const [loading, setLoading] = useState(false)
  const [linkSent, setLinkSent] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signIn({ email }, {
        redirectTo: window.location.href
      })

      if (error) throw error
      setLinkSent(true)
    } catch (error) {
      appCtx.notify(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Authentication | Dog's Paradise</title>
        <meta name='description' content="Authentication | Dog's Paradise" />
      </Head>

      {linkSent ?
        <div className='absolute top-0 bottom-0 left-0 right-0 mx-8 my-32 rounded-lg bg-green-400'>
          <div className='text-white dark:text-brand-dark text-center flex flex-col items-center justify-center h-full'>
            <h1 className='text-2xl'>Success</h1>
            <p>Check your email for the login link!</p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mt-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
            </svg>
            {/* <p className='xs'>This window can now be closed</p> */}
          </div>
        </div>
        :

        <div className='flex flex-col items-center justify-center px-4 md:px-8 py-24 lg:w-2/3 lg:mx-auto'>

          <div>
            <h1 className='text-6xl mb-12'>Login</h1>
            <p className="text-xl">Easy Login via magic link!</p>
            <p className='mb-4'> Just enter your email below:</p>

            <form className='login-form' onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='text-xl'
                disabled={loading}
                required
              />
              <div className='mt-6 w-max mx-auto'>
                <button
                  type='submit'
                  className={`button`}
                  disabled={loading}
                  aria-label='Login'
                >
                  {loading &&
                    <svg role="status" className="inline w-6 h-6 mr-3 text-brand animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>
                  }
                  {loading ? 'Sending...' : 'Send magic link'}
                </button>
              </div>
            </form>

          </div>
        </div>
      }
    </>
  )
}

export async function getStaticProps(context) {
  let i18n
  context.locale === 'en' ?
    i18n = langEN.auth :
    i18n = langES.auth
  return {
    props: { i18n },
  }
}

export default Auth
