import Head from 'next/head'
import Link from 'next/link'
import langEN from '../../i18n/en.json'
import langES from '../../i18n/es.json'
import Blob from '../../components/Blob'
import Quote from '../../components/Quote'

const Services = ({ i18n }) => {

  const services = [
    {
      title: 'Pickup Service',
      desc: 'We pickup your dog(s) at your home at your specified time.',
      img: '/icons/services/pickup.png',
      link: '/services/pickup'
    },
    {
      title: 'Delivery Service',
      desc: 'We deliver purchased products to your home at your specified time.',
      img: '/icons/services/delivery.svg',
      link: '/services/delivery'
    },
    {
      title: 'Dog Day Spa',
      desc: 'The preferred way to pamper your four-legged family member!',
      img: '/icons/services/spa.png',
      link: '/services/spa'
    },
    {
      title: 'Dog Walking',
      desc: 'Your dog walker can stop by as many times as you need – on whatever days you need them.',
      img: '/icons/services/walker.png',
      link: '/services/walker'
    }
  ]

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>

      <div className='flex flex-col items-center justify-center px-8 pb-16 lg:w-2/3 lg:mx-auto text-brand-dark'>
        <Quote text={i18n.Q1} classes={'block md:hidden'} />

        <div className='hidden md:block'>
          <Blob classes='md:m-12' node={
            <Quote text={i18n.Q1} />
          } />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 items-center justify-center my-20 gap-6' >
          {services.map(s => (
            <Link href={s.link} key={s.title}>
              <a className='shadow bg-slate-100 rounded-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-all relative'>
                <div className=' absolute -top-2 -left-2 rounded-lg bg-brand text-white px-2 py-1'>New</div>
                <h2 className='bg-white p-4 text-xl rounded-t-lg w-full'>{s.title}</h2>
                <img src={s.img} alt='Pickup Service' width={150} height={150} className='my-4' />
                <p className='h-16 px-8 text-sm'>{s.desc}</p>
              </a>
            </Link>
          ))}
        </div>

      </div>
      {/* <img src='/img/pool.jpg' alt='Pool' className='shadow' /> */}
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
