import Head from 'next/head'
import Header from '../components/Header'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'

const Appointments = ({ i18n }) => {

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>

      <Header content={i18n.T1} />

      <div className='flex flex-col items-center justify-center px-4 md:px-8 py-24 lg:w-2/3 lg:mx-auto'>
        {/* <h1 className='text-4xl md:text-6xl mb-12 mt-4'>{i18n.T1}</h1> */}

        <p>No appointments yet.</p>

      </div>
    </>
  )
}

export async function getStaticProps(context) {
  let i18n
  context.locale === 'en' ?
    i18n = langEN.appointments :
    i18n = langES.appointments
  return {
    props: { i18n },
  }
}

export default Appointments
