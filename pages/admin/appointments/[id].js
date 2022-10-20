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
import Select from 'react-select'
import selectStyles from '../../../lib/selectStyles'
import { timeOptions } from '../../../lib/config'

const Appointment = ({ appointment, users }) => {
  const { id, type, date, time, service_option, dogs, users: creator, pickups, assigned_to, extras, confirmed, done } = appointment
  let image_url, coordinates, phone_number

  if (pickups?.length) {
    image_url = pickups[0].image_url
    coordinates = pickups[0].coordinates
    phone_number = pickups[0].phone_number
  }

  const { session, darkmode, notify } = useApp()
  const router = useRouter()
  const [pickupImageUrl, setPickupImageUrl] = useState(null)
  const [edit, setEdit] = useState(false)
  const [newTime, setNewTime] = useState()
  const [styles, setStyles] = useState()

  const userOptions = users.map(user => (
    { value: user.id, label: user.username }
  ))

  const handleUserSelect = async (e) => {
    await supabase
      .from('appointments')
      .update({ assigned_to: e.value })
      .eq('id', id)
    notify(`User successfully assigned`)
  }

  useEffect(() => {
    const tempStyles = selectStyles(darkmode)
    setStyles(tempStyles)
  }, [darkmode])

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

  const confirmTime = async (id) => {
    await supabase
      .from('appointments')
      .update({ confirmed: true })
      .eq('id', id)
    router.reload()
  }

  const saveNewTime = async () => {
    await supabase
      .from('appointments')
      .update({ time: newTime.value, confirmed: true })
      .eq('id', id)
    router.reload()
  }

  if (!session) return <Auth />

  return (
    <>
      <Head>
        <title>Appointment | {date} {time} | {dogs.name}</title>
        <meta name='description' content={`Appointment | ${date} ${time} | ${dogs.name}`} />
      </Head>
      <Header content='Appointment' />
      <BackBtn href='/admin/appointments' />

      <div className='px-8 py-24 mx-auto max-w-max text-left md:text-center'>
        <div className='flex flex-col md:flex-row items-start md:items-center justify-center text-left gap-4 md:gap-12 whitespace-nowrap text-2xl md:border-b border-brand mx-auto my-4'>
          <p><span className='text-xs block'>Date/Time </span>{date} at {time}</p>
          <p><span className='text-xs block'>Service </span><span className='capitalize'>{type.split('-').join(' ')}</span></p>
          <p><span className='text-xs block'>Dog </span>{dogs.name}</p>
          <p><span className='text-xs block'>User </span>{creator.username}</p>
          <p><span className='text-xs block'>Delivery/Pickup </span>{service_option ? `Yes` : `No`}</p>
        </div>

        {phone_number && <p className='text-xs'>Phone Number: <a href={`tel:${phone_number}`} className='text-xl'>{phone_number}</a> (Click to call)</p>}
        <p className='text-xs mt-1'>Booked Extras: <span>{extras}</span></p>
        {edit &&
          <div className='w-max md:mx-auto mt-4'>
            <Select
              options={timeOptions}
              onChange={setNewTime}
              instanceId
              styles={styles}
            />
            <button onClick={() => setEdit(false)} className='mr-2 mt-1 text-sm hover:underline'>Cancel</button>
            <button onClick={saveNewTime} className='hover:underline text-sm' disabled={!newTime}>Save</button>
          </div>
        }

        {!confirmed ?
          <div className='flex items-center justify-center gap-4 mt-8 text-xs'>
            <button onClick={() => confirmTime(id)} className='button text-sm mr-4' disabled={edit}>Confirm Time</button>
            <button onClick={() => setEdit(true)} className='button text-sm' disabled={edit}>Change Time</button>
          </div>
          :
          done ?
            <p className='mt-8 text-xs'>This appointment has been marked as done/finished.</p>
            :
            <>
              <div className='flex md:justify-center items-center gap-2 mt-4'>
                <span>Assigned to</span>
                <Select
                  options={userOptions}
                  onChange={handleUserSelect}
                  instanceId // Needed to prevent errors being thrown
                  defaultValue={userOptions.filter(o => o.value === assigned_to)}
                  styles={styles}
                />
              </div>
              <div className='mt-4 flex items-center justify-center gap-2'>
                <button onClick={() => markAsDone(id)} className='button button-sm text-sm'>DONE</button>
                <p className='text-xs'>Only click this button, if the appointment has been done/finished.</p>
              </div>
            </>
        }

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
    const { data: appointment } = await supabase
      .from('appointments')
      .select(`*, dogs(*), pickups(*), users!appointments_user_fkey(*)`)
      .eq('id', id)
      .single()

    const { data: users } = await supabase
      .from('users')
      .select(`*`)
      .order('username', { ascending: true })

    return {
      props: { appointment, users },
    }
  }
}

export default Appointment
