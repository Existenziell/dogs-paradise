import { Auth } from '@supabase/ui'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Head from 'next/head'

const SupaAuth = ({ i18n }) => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Authentication | Dog's Paradise</title>
        <meta name='description' content="Authentication | Dog's Paradise" />
      </Head>

      <div className='flex flex-col items-center justify-center px-4 md:px-8 py-24'>
        <div className='max-w-xl'>
          <Auth.UserContextProvider supabaseClient={supabase}>
            <Auth
              supabaseClient={supabase}
              socialLayout="horizontal"
              socialButtonSize="xlarge"
              socialColors={false}
              magicLink
              redirectTo={router.pathname}
              providers={['google', 'facebook', 'github']}
            />
          </Auth.UserContextProvider>
        </div>
      </div>
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

export default SupaAuth
