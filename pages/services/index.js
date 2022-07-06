import Head from 'next/head'
import Link from 'next/link'
import langEN from '../../i18n/en.json'
import langES from '../../i18n/es.json'
import Blob from '../../components/Blob'
import Quote from '../../components/Quote'
import Header from '../../components/Header'
import { services } from '../../lib/services'

const Services = ({ i18n }) => {
  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>
      <Header content={i18n.T1} />

      <div className='flex flex-col items-center justify-center px-8 pb-16 pt-24 text-brand-dark'>
        <Quote text={i18n.Q1} classes={'block md:hidden'} />

        <div className='hidden md:block'>
          <Blob classes='md:m-12' node={
            <Quote text={i18n.Q1} />
          } />
        </div>

        <div className='flex flex-wrap items-center justify-center my-20 gap-6' >
          {services.map((s) => (
            <Link href={`/appointments/create?slug=${s.slug}&service=${s.title}`} key={s.title}>
              <a className='min-w-[250px] shadow-md bg-slate-100 dark:bg-brand-dark rounded-lg flex flex-col items-center cursor-pointer hover:shadow-sm transition-all relative'>
                {s.isNew &&
                  <div className='absolute -top-2 -left-2 rounded-lg bg-brand text-white text-sm px-2 py-1'>NEW</div>
                }
                <h2 className='bg-white dark:bg-brand-dark dark:text-white p-4 text-xl rounded-t-lg w-full'>{s.title}</h2>
                <img src={s.img} alt='Pickup Service' className='h-20 max-h-20 my-6 dark:invert' />
                {/* <p className='h-16 px-8 text-sm dark:text-white'>{s.desc}</p> */}
              </a>
            </Link>
          ))}
        </div>

      </div>
      <img src='/img/pool.jpg' alt='Pool' className='shadow mx-auto' />
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

export default Services
