import { Auth as SupaAuth } from '@supabase/ui'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { BASE_URL } from '../lib/config'
import Head from 'next/head'
import Header from './Header'

const Auth = () => {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>Authentication | Dog&apos;s Paradise</title>
        <meta name='description' content='Authentication | Dog&apos;s Paradise' />
      </Head>
      <Header content='Signup/Signin' />

      <div className='flex flex-col items-center justify-center px-4 py-24 md:px-8'>
        <div className='max-w-xl'>
          <SupaAuth.UserContextProvider supabaseClient={supabase}>
            <SupaAuth
              supabaseClient={supabase}
              socialLayout="horizontal"
              socialButtonSize="xlarge"
              socialColors={false}
              magicLink
              redirectTo={BASE_URL + router.pathname}
              providers={['google', 'facebook', 'github']}
            />
          </SupaAuth.UserContextProvider>
        </div>
        <img src='/icons/paws-turquoise.webp' alt='Paws' className='w-32 my-12 block' />
      </div>
    </>
  )
}

// export async function getStaticProps(context) {
//   let i18n
//   context.locale === 'en' ?
//     i18n = langEN.auth :
//     i18n = langES.auth

//   return {
//     props: { i18n },
//   }
// }

export default Auth
