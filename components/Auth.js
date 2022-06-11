import { Auth as SupaAuth } from '@supabase/ui'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { BASE_URL } from '../lib/config'
import Head from 'next/head'

const Auth = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Authentication | Dog&apos;s Paradise</title>
        <meta name='description' content='Authentication | Dog&apos;s Paradise' />
      </Head>

      <div className='flex flex-col items-center justify-center px-4 pb-16 md:px-8'>
        <img src='/icons/paws.png' alt='Paws' className='w-32 mt-2 mb-12 block' />
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
