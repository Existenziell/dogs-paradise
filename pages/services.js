import Head from 'next/head'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'
import Blob from '../components/Blob'
import Quote from '../components/Quote'

const Services = ({ i18n }) => {

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>

      <div className='flex flex-col items-center justify-center  py-24 lg:w-2/3 lg:mx-auto'>
        <h1 className='text-6xl mb-12'>{i18n.T1}</h1>

        <Quote text={i18n.Q1} classes={'block md:hidden'} />

        <div className='hidden md:block'>
          <Blob classes='md:m-24' node={
            <Quote text={i18n.Q1} />
          } />
        </div>
      </div>
      <img src='/img/pool.jpg' alt='Pool' />
    </>
  )
}

export async function getStaticProps(context) {
  let i18n
  context.locale === 'en' ?
    i18n = langEN.services :
    i18n = langES.services
  return {
    props: { i18n },
  }
}

export default Services
