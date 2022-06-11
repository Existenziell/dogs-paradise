import Head from 'next/head'
import Link from 'next/link'
import AddToHomeScreen from '../components/AddToHomeScreen'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'
import Header from '../components/Header'
import { services } from '../lib/services'

const Home = ({ i18n }) => {
  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>

      <Header content={i18n.T1} />

      <div className='px-8 profile py-24'>
        <h1 className='text-4xl mb-8'>{i18n.T3}</h1>
        <img src='/welcome.jpg' alt='Welcome Dog' className='w-36 rounded-md shadow mx-auto' />
        <div className='my-8 flex gap-8 items-center justify-center'>
          <Link href='/profile'><a className='button'>Login</a></Link>
          <Link href='/profile'><a className='button'>Profile</a></Link>
        </div>
        <div className='flex flex-col md:flex-row gap-4 justify-center items-center w-full'>
          <video src='/video/promo.mp4' controls={true} loop={false} autoPlay={false} className='max-w-xs md:w-1/2 mx-auto rounded-md' />

          <div className='flex flex-wrap items-center justify-center my-20 gap-6'>
            {services.map(s => (
              <Link href={s.link} key={s.title}>
                <a className='max-w-max min-w-[150px] shadow-md bg-slate-100 dark:bg-brand-dark rounded-lg flex flex-col items-center cursor-pointer hover:shadow-sm transition-all relative'>
                  <h2 className='bg-white dark:bg-brand-dark dark:text-white p-4 text-lg rounded-t-lg w-full'>{s.title}</h2>
                  <img src={s.img} alt='Pickup Service' width={60} height={60} className='my-4 dark:invert' />
                </a>
              </Link>
            ))}
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
