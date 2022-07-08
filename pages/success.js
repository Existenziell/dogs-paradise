import Link from 'next/link'
import Head from 'next/head'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'

const Success = ({ i18n }) => {
  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>

      <div className='flex flex-col items-center justify-center h-screen text-brand'>
        <Link href='/'>
          <a>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-32 w-32 text-brand hover:scale-105 transition-all' viewBox='0 0 20 20' fill='currentColor'>
              <path fillRule='evenodd' d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z' clipRule='evenodd' />
            </svg>
          </a>
        </Link>
        <h1 className='text-6xl my-8'>{i18n.T1}</h1>

        <div className='flex'>
          <Link href='/'><a className='button mr-6'>{i18n.B1}</a></Link>
          <Link href='/services'><a className='button'>{i18n.B2}</a></Link>
        </div>

      </div>
    </>
  )
}

export async function getStaticProps(context) {
  let i18n
  context.locale === 'en' ?
    i18n = langEN.success :
    i18n = langES.success
  return {
    props: { i18n },
  }
}

export default Success
