import Head from 'next/head'

const Hotel = () => {
  return (
    <>
      <Head>
        <title>Canine Hotel</title>
        <meta name='description' content="Canine Hotel" />
      </Head>

      <div className='flex flex-col items-center justify-center py-24 px-8 lg:w-2/3 lg:mx-auto'>
        <h1 className='text-4xl md:text-6xl mb-12'>Canine Hotel</h1>
        <img src='/img/hotel.jpg' alt='Hotel' className='max-w-xs shadow rounded mb-8' />
      </div>
    </>
  )
}

export default Hotel
