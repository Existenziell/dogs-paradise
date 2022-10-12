import Head from 'next/head'

const Venue = () => {
  return (
    <>
      <Head>
        <title>Venue</title>
        <meta name='description' content='Venue' />
      </Head>

      <div className='py-24 px-4'>
        <h1 className='text-4xl md:text-6xl mb-8 mt-4'>Venue</h1>
        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <div className='grid grid-cols-2 gap-8 items-center p-12'>
          <img src='/img/venue/1.jpg' alt='Venue1' className='shadow-lg rounded' />
          <img src='/img/venue/2.jpg' alt='Venue2' className='shadow-lg rounded' />
          <img src='/img/venue/3.jpg' alt='Venue3' className='shadow-lg rounded' />
          <img src='/img/venue/4.jpg' alt='Venue4' className='shadow-lg rounded' />
          <img src='/img/venue/5.jpg' alt='Venue5' className='shadow-lg rounded' />
          <img src='/img/venue/6.jpg' alt='Venue6' className='shadow-lg rounded' />
        </div>
      </div>
    </>
  )
}

export default Venue
