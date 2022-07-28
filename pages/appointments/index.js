import { supabase } from '../../lib/supabase'
import { useEffect, useState } from 'react'
import { PulseLoader } from 'react-spinners'
import { ShieldExclamationIcon } from '@heroicons/react/outline'
import Auth from '../../components/Auth'
import Head from 'next/head'
import Header from '../../components/Header'
import langEN from '../../i18n/en.json'
import langES from '../../i18n/es.json'
import getAppointments from '../../lib/getAppointments'
import useApp from '../../context/AppContext'
import Link from 'next/link'

const Appointments = ({ i18n }) => {
  const [appointments, setAppointments] = useState(null)
  const { session, currentUser, notify } = useApp()
  const [appointmentToDelete, setAppointmentToDelete] = useState()
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    if (currentUser) fetchAppointments(currentUser.id)
  }, [currentUser])

  const fetchAppointments = async (id) => {
    const appointments = await getAppointments(id)
    setAppointments(appointments)
  }

  const toggleDeleteModal = (appointment) => {
    setAppointmentToDelete(appointment)
    setShowDelete(true)
  }

  const deleteAppointment = async () => {

    const { error } = await supabase
      .from('pickups')
      .delete()
      .eq('appointment', appointmentToDelete.id)

    if (!error) {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentToDelete.id)

      if (!error) {
        notify("Appointment deleted successfully!")
        setShowDelete(false)
        const filteredAppointments = appointments.filter(c => { return c.id !== appointmentToDelete.id })
        setAppointments(filteredAppointments)
      } else {
        notify("Appointment cannot be deleted.")
      }
    }
    else {
      console.log(error)
    }
  }

  if (!session) return <Auth />

  if (!appointments) {
    return (
      <div className='flex items-center justify-center pt-[25%]'>
        <PulseLoader color={'var(--color-brand)'} size={20} />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>
      <Header content={i18n.T1} />

      <div className='flex flex-col items-center justify-center px-4 md:px-8 py-24'>
        <div className='flex items-center justify-center gap-4 mb-6'>
          <Link href='/appointments/create'><a className='button-secondary'>Create Appointment</a></Link>
          <Link href='/contact'><a className='button-secondary text-xs'>Contact Us</a></Link>
        </div>
        {appointments.length ?
          appointments.map(appointment => {
            const { id, type, date, time, service_option, dogs, pickups, extras } = appointment

            return (
              <div key={id} className='bg-white text-brand-dark dark:bg-brand-dark dark:text-white rounded px-4 py-3 my-3 text-left w-full max-w-4xl mb-12'>
                <div className='flex items-center justify-start gap-12 '>
                  <div className='text-xl flex flex-col gap-4 w-1/2'>
                    <p><span className='text-xs block'>Service: </span><span className='capitalize'>{type.split('-').join(' ')}</span></p>
                    <p><span className='text-xs block'>Date/Time: </span>{date} at {time}</p>
                  </div>

                  <div className='text-xl flex flex-col gap-4 '>
                    <p><span className='text-xs block'>Dog: </span>{dogs.name}</p>
                    <p><span className='text-xs block'>Delivery/Pickup Requested? </span>{service_option ? `Yes` : `No`}</p>
                  </div>
                </div>

                {extras &&
                  <div className='mt-4'>
                    Booked Extras: {extras}
                  </div>
                }

                {service_option && pickups.length === 0 &&
                  <div className='mt-4'>
                    <ShieldExclamationIcon className='w-6 text-brand inline-block mr-2' />
                    Your action is required. Please fill out{` `}
                    <Link href={`/services/pickup?appointment=${id}`}><a className='link'>this form</a></Link>{` `}
                    to proceed.
                  </div>
                }

                {pickups.length > 0 &&
                  <div className='mt-4 text-sm'>
                    <p>Associated phone number:</p>
                    <span className='text-xl'>{pickups[0].phone_number}</span>
                  </div>
                }

                <button onClick={() => toggleDeleteModal(appointment)} className='mt-6 button-secondary text-xs block md:inline-block'>Cancel Appointment</button>
              </div>
            )
          })
          :
          <p>No appointments yet.</p>
        }

      </div>
      {/* Delete appointment */}
      {showDelete &&
        <div className='fixed top-0 bottom-0 left-0 right-0 z-20 text-lg '>
          <div className='w-full h-full bg-black/80 flex items-center justify-center'>
            <div className='flex flex-col items-center justify-center backdrop-blur-lg bg-white text-brand-dark rounded p-12'>
              <button onClick={() => setShowDelete(false)} className='absolute top-0 right-0 px-2 py-0 rounded-sm hover:text-brand text-2xl hover:bg-gray-100' aria-label='Close Delete Dialog'>
                &times;
              </button>
              <p className='text-sm'>Deleting appointment on {appointmentToDelete.date} for {appointmentToDelete.type} service</p>
              <p className='text-2xl mt-2'>Are you sure?</p>
              <div className='flex items-center gap-4 mt-6'>
                <button onClick={() => setShowDelete(false)} className='hover:text-brand hover:underline' aria-label='Cancel'>Cancel</button>
                <button onClick={deleteAppointment} className='hover:text-brand hover:underline' aria-label='Yes'>Yes</button>
              </div>
            </div>
          </div>
        </div>
      }
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
