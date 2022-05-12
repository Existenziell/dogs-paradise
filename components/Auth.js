import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const Auth = ({ i18n }) => {
  const [loading, setLoading] = useState(false)
  const [linkSent, setLinkSent] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (email) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signIn({ email })
      if (error) throw error
      setLinkSent(true)
    } catch (error) {
      console.log(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
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

          <div className="">
            <h1 className='text-6xl mb-12'>Login</h1>
            <p className="text-xl">Easy Login via magic link!</p>
            <p className='mb-4'> Just enter your email below:</p>

            <form className='login-form'>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='text-xl'
              />
              <div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleLogin(email)
                  }}
                  className="button mt-4"
                  disabled={loading}
                  aria-label='Login'
                >
                  <span>{loading ? 'Loading' : 'Send magic link'}</span>
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
