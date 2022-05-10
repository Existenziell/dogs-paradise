import Link from 'next/link'
import Head from 'next/head'
// import langEN from '../i18n/en.json'
// import langES from '../i18n/es.json'

const Venue = () => {
  return (
    <>
      <Head>
        <title>Venue</title>
        <meta name='description' content='Venue' />
      </Head>

      <div className='py-24'>
        <h1 className='text-4xl mb-8'>Venue</h1>
        <div className='grid grid-cols-2 gap-8 items-center p-12'>
          <img src='/img/venue/1.jpg' alt='Venue1' className='' />
          <img src='/img/venue/2.jpg' alt='Venue2' className='' />
          <img src='/img/venue/3.jpg' alt='Venue3' className='' />
          <img src='/img/venue/4.jpg' alt='Venue4' className='' />
          <img src='/img/venue/5.jpg' alt='Venue5' className='' />
          <img src='/img/venue/6.jpg' alt='Venue6' className='' />
        </div>
      </div>
    </>
  )
}

// export async function getStaticProps(context) {
//   let i18n
//   context.locale === 'en' ?
//     i18n = langEN.venue :
//     i18n = langES.venue
//   return {
//     props: { i18n },
//   }
// }

export default Venue
