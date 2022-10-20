import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import useApp from '../../../context/AppContext'
import Head from 'next/head'
import Auth from '../../../components/Auth'
import Header from '../../../components/Header'
import BackBtn from '../../../components/BackBtn'
import downloadImage from '../../../lib/supabase/downloadImage'
import MapLocation from '../../../components/services/MapLocation'

const DashoardItem = ({ appointment }) => {
  const { type, date, time, service_option, dogs, users: creator, pickups, extras } = appointment
  let image_url, coordinates, phone_number

  if (pickups?.length) {
    image_url = pickups[0].image_url
    coordinates = pickups[0].coordinates
    phone_number = pickups[0].phone_number
  }

  const { session } = useApp()
  const [pickupImageUrl, setPickupImageUrl] = useState(null)

  useEffect(() => {
    if (image_url) {
      downloadImage('pickups', image_url, setPickupImageUrl)
    }
  }, [image_url])

  if (!session) return <Auth />

  return (
    <>
      <Head >
        <title>Admin Dashboard | Dog&apos;s Paradise</title>
        <meta name='description' content='Admin Dashboard | Dog&apos;s Paradise' />
      </Head>
      <Header content='Appointment' />
      <BackBtn href='/admin/dashboard' />

      <div className='px-8 pt-24 mx-auto max-w-max text-left md:text-center'>
        <div className='flex flex-col md:flex-row items-start md:items-center justify-center text-left gap-4 md:gap-12 whitespace-nowrap text-2xl md:border-b border-brand mx-auto my-4'>
          <p><span className='text-xs block'>Date/Time </span>{date} at {time}</p>
          <p><span className='text-xs block'>Service </span><span className='capitalize'>{type.split('-').join(' ')}</span></p>
          <p><span className='text-xs block'>Dog </span>{dogs.name}</p>
          <p><span className='text-xs block'>User </span>{creator.username}</p>
          <p><span className='text-xs block'>Delivery/Pickup </span>{service_option ? `Yes` : `No`}</p>
        </div>

        {phone_number && <p className='text-xs'>Phone Number: <a href={`tel:${phone_number}`} className='text-xl'>{phone_number}</a> (Click to call)</p>}
        <p className='text-xs mt-1'>Booked Extras: <span>{extras}</span></p>

        {service_option && pickups.length === 0 &&
          <div className='max-w-sm mx-auto md:max-w-max mt-4'>
            User has not yet filled out the required information for pickup/delivery service.
          </div>
        }
      </div>

      {pickups.length > 0 &&
        <div className='w-full h-screen mt-8 px-2 pb-[75px]'>
          <MapLocation coordinates={coordinates} phone_number={phone_number} pickupImageUrl={pickupImageUrl} extras={extras} />
        </div>
      }
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
    const { data: appointment } = await supabase
      .from('appointments')
      .select(`*, dogs(*), pickups(*), users!appointments_user_fkey(*)`)
      .eq('id', id)
      .single()

    return {
      props: { appointment },
    }
  }
}

export default DashoardItem
