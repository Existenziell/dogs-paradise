import Head from 'next/head'
// import langEN from '../../i18n/en.json'
// import langES from '../../i18n/es.json'

const Delivery = () => {

  return (
    <>
      <Head>
        <title>Delivery Service</title>
        <meta name='description' content="Delivery Service" />
      </Head>

      <div className='flex flex-col items-center justify-center py-24 px-8 lg:w-2/3 lg:mx-auto'>
        <h1 className='text-4xl md:text-6xl mb-12'>Delivery Service</h1>

      </div>
    </>
  )
}

// export async function getStaticProps(context) {
//   let i18n
//   context.locale === 'en' ?
//     i18n = langEN.services :
//     i18n = langES.services
//   return {
//     props: { i18n },
//   }
// }

export default Delivery
