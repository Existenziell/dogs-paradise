import Head from 'next/head'

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

export default Walker
