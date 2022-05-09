import Head from 'next/head'
import Link from 'next/link'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'
import AddToHomeScreen from '../components/AddToHomeScreen'
import { supabase } from '../lib/supabase'

const Paradise = ({ i18n }) => {
  const user = supabase.auth.user()

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>

      <header className='flex items-center justify-center h-screen sm:bg-fixed bg-center bg-cover bg-parallax-1-m md:bg-parallax-1'>
        <a href='#anchor' aria-label='Scroll down'>
          <h1 className='px-6 py-4 text-6xl text-white bg-brand/80 dark:text-brand dark:bg-brand-dark/80 rounded'>
            {i18n.T1}
          </h1>
        </a>
      </header>

      <div className='max-w-xl m-auto px-4 leading-relaxed my-16' id='anchor'>
        <p>{i18n.T2}</p>
        <h2 className='text-6xl my-8'>{i18n.T3}</h2>
        {user
          ? <p>Hello {user?.email} &rarr; <a href='/profile' className='link'>Go to your Profile</a></p>
          : <p>New to the App? &rarr; <a href='/profile' className='link'>Become a member</a></p>
        }
        <p className='mt-8'>{i18n.T4}</p>
        <div className='my-8 flex flex-col sm:flex-row items-center justify-center gap-2'>
          <Link href='/services'><a className='button inline-block'>{i18n.B1}</a></Link>
          <Link href='/map'><a className='button inline-block'>{i18n.B2}</a></Link>
        </div>

        <AddToHomeScreen />
        <p className='mt-8 leading-loose'>{i18n.T5}</p>
      </div>

      <section className='flex items-center justify-center h-screen mb-12 sm:bg-fixed bg-center bg-cover bg-parallax-2-m md:bg-parallax-2'>
        <p className='w-full px-6 py-8 text-white bg-brand-dark/80 rounded flex flex-col sm:flex-row items-center justify-center gap-2'>
          <Link href='/services'><a className='button inline-block'>{i18n.B1}</a></Link>
          <Link href='/map'><a className='button inline-block'>{i18n.B2}</a></Link>
        </p>
      </section>

      <div className='flex flex-col items-center justify-center px-6'>
        <p className='text-lg my-8 max-w-xl mx-auto leading-loose'>{i18n.T6}</p>
        <p className='mt-8 pb-16'>{i18n.T7}</p>
      </div>

    </>
  )
}

export async function getStaticProps(context) {
  let i18n
  context.locale === 'en' ?
    i18n = langEN.home :
    i18n = langES.home
  return {
    props: { i18n },
  }
}

export default Paradise
