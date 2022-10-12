import Head from 'next/head'

const Spa = () => {
  return (
    <>
      <Head>
        <title>Spa Service</title>
        <meta name='description' content="Spa Service" />
      </Head>

      <div className='flex flex-col items-center justify-center py-24 px-8 lg:w-2/3 lg:mx-auto'>
        <h1 className='text-6xl mb-12'>Dog Spa</h1>

      </div>
    </>
  )
}

export default Spa
