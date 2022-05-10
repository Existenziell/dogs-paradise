import Head from 'next/head'
import Link from 'next/link'
import langEN from '../../i18n/en.json'
import langES from '../../i18n/es.json'

const Spa = ({ i18n }) => {

  return (
    <>
      <Head>
        <title>Day Spa Service</title>
        <meta name='description' content="Day Spa Service" />
      </Head>

      <div className='flex flex-col items-center justify-center py-24 px-8 lg:w-2/3 lg:mx-auto'>
        <h1 className='text-6xl mb-12'>Dog Day Spa</h1>

      </div>
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

export default Spa
