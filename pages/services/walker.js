import Head from 'next/head'
// import langEN from '../../i18n/en.json'
// import langES from '../../i18n/es.json'

const Walker = () => {

  return (
    <>
      <Head>
        <title>Dog Walker Service</title>
        <meta name='description' content="Dog Walker Service" />
      </Head>

      <div className='flex flex-col items-center justify-center py-24 px-8 lg:w-2/3 lg:mx-auto'>
        <h1 className='text-6xl mb-12'>Dog Walker Service</h1>

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

export default Walker
