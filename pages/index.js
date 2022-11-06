import Head from 'next/head'
import Link from 'next/link'
import AddToHomeScreen from '../components/AddToHomeScreen'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'
import Header from '../components/Header'
import Quote from '../components/Quote'
import useApp from '../context/AppContext'
import Image from 'next/image'
import ServicesList from '../components/ServicesList'

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
        <h1 className='text-4xl md:text-6xl'>{i18n.T3}</h1>
        <p className='text-sm'>Feel the Paradise Experience</p>

        <div className='nextimg shadow-2xl max-w-max my-12 mx-auto'>
          <Image
            src='/img/cozumel-dogs.jpg'
            alt='Cozumel Dogs'
            width={400}
            height={400}
            className='rounded w-full'
            placeholder='blur'
            blurDataURL='/img/cozumel-dogs.jpg'
          />
        </div>

        <Link href='/profile'><a className='button block max-w-max mx-auto mb-8'>{session ? `Profile` : `Login`}</a></Link>
        <div className='mb-8'>
          <AddToHomeScreen />
        </div>

        <div className='flex flex-wrap items-center justify-center mb-20 gap-6'>
          <ServicesList />
        </div>

        <div className='flex flex-col md:flex-row gap-4 justify-center items-center w-full mb-16'>
          <video src='/video/promo.mp4'
            controls={true}
            loop={false}
            autoPlay={false}
            poster="/video/poster.jpg"
            className='max-w-xs md:w-1/2 mx-auto rounded-md'
          />
          <div className='flex flex-col items-center justify-center'>
            <Quote text='Our job is to make them happy' classes='mb-8' />
            <div className='nextimg py-4'>
              <Image
                src='/logo.webp'
                alt='Logo'
                width={300}
                height={300}
                placeholder='blur'
                blurDataURL='/logo.webp'
                className='max-w-xs rounded dark:invert'
              />
            </div>
          </div>
        </div>
        <div className='mb-8'>
          <AddToHomeScreen />
        </div>
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
