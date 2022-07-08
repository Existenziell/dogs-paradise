import { supabase } from '../../../lib/supabase'
import { useEffect, useState } from 'react'
import Auth from '../../../components/Auth'
import Head from 'next/head'
import Header from '../../../components/Header'
import useApp from '../../../context/AppContext'
import { useRouter } from 'next/router'
import downloadImage from '../../../lib/supabase/downloadImage'
import MapLocation from '../../../components/services/MapLocation'
import BackBtn from '../../../components/BackBtn'

const Appointment = ({ appointment }) => {
  const { id, type, date, done, time, service_option, dogs, users, pickups, extras } = appointment
  let image_url, coordinates, phone_number

  if (pickups?.length) {
    image_url = pickups[0].image_url
    coordinates = pickups[0].coordinates
    phone_number = pickups[0].phone_number
  }

  const { session } = useApp()
  const router = useRouter()
  const [pickupImageUrl, setPickupImageUrl] = useState(null)

  useEffect(() => {
    if (image_url) {
      downloadImage('pickups', image_url, setPickupImageUrl)
    }
  }, [image_url])

  const markAsDone = async (id) => {
    await supabase
      .from('appointments')
      .update({ done: true })
      .eq('id', id)
    router.push('/admin/appointments')
  }

  if (!session) return <Auth />

  return (
    <>
      <Head>
        <title>Appointment | {date} {time} | {dogs.name}</title>
        <meta name='description' content={`Appointment | ${date} ${time} | ${dogs.name}`} />
      </Head>
      <Header content='Appointment' />

      <div className='px-4 md:px-8 py-24 mx-auto'>
        <BackBtn href='/admin/appointments' />

        <div className='flex flex-col md:flex-row items-start md:items-center justify-center text-left gap-4 md:gap-12 whitespace-nowrap text-2xl md:border-b border-brand max-w-max mx-auto mt-4'>
          <p><span className='text-xs block'>Date/Time </span>{date} at {time}</p>
          <p><span className='text-xs block'>Service </span><span className=' capitalize'>{type.split('-').join(' ')}</span></p>
          <p><span className='text-xs block'>Dog </span>{dogs.name}</p>
          <p><span className='text-xs block'>User </span>{users.username}</p>
          <p><span className='text-xs block'>Delivery/Pickup </span>{service_option ? `Yes` : `No`}</p>
          <p className='md:hidden'><span className='text-xs block'>Phone Number </span><a href={`tel:${phone_number}`}>{phone_number}</a><span className='text-xs'>(Click to call)</span></p>
          <p className='md:hidden text-xs whitespace-normal'>Booked Extras: {extras}</p>
        </div>

        <div className='hidden md:block'>
          <p className='text-xs mt-2'>Phone Number: <a href={`tel:${phone_number}`} className='text-xl'>{phone_number}</a> (Click to call)</p>
          <p className='text-xs mt-1'>Booked Extras: <span>{extras}</span></p>
        </div>

        {service_option && pickups.length === 0 &&
          <div className='max-w-sm mx-auto md:max-w-max mt-4'>
            User has not yet filled out the required information for pickup/delivery service.
          </div>
        }

        {pickups.length > 0 &&
          <div className='w-full h-screen mt-8'>
            <MapLocation coordinates={coordinates} phone_number={phone_number} pickupImageUrl={pickupImageUrl} extras={extras} />
          </div>
        }
        {done ?
          <p className='mt-8 text-xs'>This appointment has been marked as done/finished.</p>
          :
          <div className='mt-16'>
            <button onClick={() => markAsDone(id)} className=' button'>DONE!</button>
            <p className='text-xs mt-2 mb-12'>By clicking this button, the appointment will be marked as done/finished.</p>
          </div>
        }
      </div>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const id = params.id
  if (id === 'null') {
    return {
      props: { appointment: {} },
    }
  } else {
    let { data: appointment } = await supabase
      .from('appointments')
      .select(`*, dogs(*), pickups(*), users!appointments_user_fkey(*)`)
      .eq('id', id)
      .single()

    return {
      props: { appointment },
    }
  }

}

export default Appointment
