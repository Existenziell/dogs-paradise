import Image from 'next/image'
import Link from 'next/link'
import { services } from '../lib/services'

const ServicesList = () => {
  return (
    <>
      {services.map((s) => (
        <Link href={`/appointments/create?slug=${s.slug}&service=${s.title}`} key={s.title}>
          <a className='min-w-[250px] shadow-md bg-slate-100 dark:bg-brand-dark rounded-lg flex flex-col items-center cursor-pointer hover:shadow-sm transition-all relative'>
            {s.isNew &&
              <div className='absolute -top-2 -left-2 rounded-lg bg-brand text-white text-sm px-2 py-1'>NEW</div>
            }
            <h2 className='bg-white dark:bg-brand dark:text-white p-4 text-xl rounded-t-lg w-full'>{s.title}</h2>
            <div className='nextimg py-4'>
              <Image
                src={s.icon}
                alt={s.title}
                width={80}
                height={80}
                placeholder='blur'
                blurDataURL='/img/cozumel-dogs.jpg'
                className='dark:invert'
              />
            </div>
          </a>
        </Link>
      ))}
    </>
  )
}

export default ServicesList
