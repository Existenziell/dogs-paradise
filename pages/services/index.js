import Head from 'next/head'
import langEN from '../../i18n/en.json'
import langES from '../../i18n/es.json'
import Blob from '../../components/Blob'
import Quote from '../../components/Quote'
import Header from '../../components/Header'
import Image from 'next/image'
import ServicesList from '../../components/ServicesList'

const Services = ({ i18n }) => {
  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>
      <Header content={i18n.T1} />

      <div className='flex flex-col items-center justify-center px-8 pb-16 pt-24 text-brand-dark'>
        <Quote text={i18n.Q1} classes={'block md:hidden'} />

        <div className='hidden md:block'>
          <Blob classes='md:m-12' node={
            <Quote text={i18n.Q1} />
          } />
        </div>

        <div className='flex flex-wrap items-center justify-center my-20 gap-6' >
          <ServicesList />
        </div>
      </div>

      <Image
        src='/img/pool.jpg'
        alt='Pool'
        width={1500}
        height={418}
        placeholder='blur'
        blurDataURL='/img/pool.jpg'
      />
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
