import Head from 'next/head'
import Link from 'next/link'
import AddToHomeScreen from '../components/AddToHomeScreen'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'
import Header from '../components/Header'
import { services } from '../lib/services'
import Quote from '../components/Quote'
import useApp from '../context/AppContext'

const Home = ({ i18n }) => {
  const { session } = useApp()

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>
      <Header content={i18n.T1} />

      <div className='px-8 profile py-24 max-w-4xl mx-auto'>
        <h1 className='text-4xl'>{i18n.T3}</h1>
        <p className='text-sm'>Feel the Paradise Experience</p>
        <div className='mt-8 flex gap-8 items-center justify-center'>
          {session ?
            <Link href='/profile'><a className='button'>Profile</a></Link>
            :
            <Link href='/profile'><a className='button'>Login</a></Link>
          }
        </div>

        <div className='flex flex-wrap items-center justify-center mb-20 mt-12 gap-6'>
          {services.map(s => (
            <Link href={`/appointments/create?slug=${s.slug}&service=${s.title}`} key={s.slug}>
              <a className='max-w-max min-w-[200px] shadow-md bg-slate-100 dark:bg-brand-dark rounded-lg flex flex-col items-center cursor-pointer hover:shadow-sm transition-all relative'>
                <h2 className='bg-white dark:bg-black dark:text-white p-4 text-lg rounded-t-lg w-full'>{s.title}</h2>
                <img src={s.icon} alt={s.title} className='my-4 h-20 max-h-20 dark:invert' />
              </a>
            </Link>
          ))}
        </div>

        <div className='flex flex-col md:flex-row gap-4 justify-center items-center w-full mb-16'>
          <video src='/video/promo.mp4' controls={true} loop={false} autoPlay={false} className='max-w-xs md:w-1/2 mx-auto rounded-md' />
          <div className='flex flex-col items-center justify-center'>
            <Quote text='Our job is to make them happy' classes='mb-8' />
            <img src='/logo.png' alt='Logo' className='max-w-xs rounded shadow-md dark:shadow-none dark:invert' />
          </div>
        </div>

        <AddToHomeScreen />
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

export default Home
