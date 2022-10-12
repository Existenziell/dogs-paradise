import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { CheckIcon } from '@heroicons/react/outline'
import useApp from '../../../context/AppContext'
import Head from 'next/head'
import Auth from '../../../components/Auth'
import Link from 'next/link'
import { SyncLoader } from 'react-spinners'

const Dashoard = () => {
  const { currentUser, session } = useApp()
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState([])

  const fetchAppointments = async (id) => {
    const { data: appointments } = await supabase
      .from('appointments')
      .select(`*, dogs(*), users(*)`)
      .eq('assigned_to', id)
      .eq('confirmed', true)
      .eq('done', false)
      .order('date', { ascending: false })
      .order('time', { ascending: false })
    setAppointments(appointments)
    setLoading(false)
  }

  useEffect(() => {
    if (currentUser) {
      fetchAppointments(currentUser.id)
    }
  }, [currentUser])

  if (loading) return <div className='pt-32'><SyncLoader size={10} color='var(--color-brand)' /></div>
  if (!session) return <Auth />

  return (
    <>
      <Head >
        <title>Admin Dashboard | Dog&apos;s Paradise</title>
        <meta name='description' content='Admin Dashboard | Dog&apos;s Paradise' />
      </Head>

      <div className='py-16'>
        <div className='py-8 px-8 text-left'>
          <div className='flex justify-between items-center mb-1'>
            <p className='text-sm mb-2'>{appointments.length} open appointments are assigned to you.</p>
          </div>
          <div>
            <div className='relative flex flex-col gap-4 pb-16'>
              {appointments.map((appointment) => {
                const { id, date, time, type, dogs, users, service_option } = appointment
                return (
                  <Link href={`/admin/dashboard/${id}`} key={id}>
                    <a className='flex flex-wrap justify-between gap-4 mb-4 p-4 bg-white dark:bg-brand-dark rounded-sm'>
                      <div className='text-xs'><h2>Date</h2><p className='text-base'>{date}</p></div>
                      <div className='text-xs'><h2>Time</h2><p className='text-base'>{time}</p></div>
                      <div className='text-xs'><h2>Service</h2><p className='capitalize text-base'>{type.split('-').join(' ')}</p></div>
                      <div className='text-xs'><h2>Client</h2><p className='text-base'>{users.username}</p></div>
                      <div className='text-xs'><h2>Dog</h2><p className='text-base'>{dogs.name}</p></div>
                      <div className='text-xs'><h2>Pickup</h2><p className='text-base'>{service_option ? <CheckIcon className='w-6' /> : `No`}</p></div>
                      {/* <div className='text-xs'><h2>Extras</h2><p className='whitespace-normal'>{extras}</p></div> */}
                      {/* <div className='text-xs'><h2>Price</h2><p className='text-base'>{price} MXN</p></div> */}
                      {/* <div className='text-xs'><h2>Confirmed</h2><p className='text-base'>{confirmed ? <CheckIcon className='w-6' /> : `No`}</p></div> */}
                      {/* <div className='text-xs'><h2>Done</h2><p className='text-base'>{done ? <CheckIcon className='w-6' /> : `No`}</p></div> */}
                    </a>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// export async function getServerSideProps() {
//   const { data: appointments } = await supabase
//     .from('appointments')
//     .select(`*, dogs(*)`)
//     .eq('assigned_to', currentUser.id)
//     .order('date', { ascending: false })
//     .order('time', { ascending: false })

//   // Gather additional information from user
//   for (const appointment of appointments) {
//     // Who is the client asking for this appointment?
//     const { data: client } = await supabase.from('users').select(`*`).eq('id', appointment.user).single()
//     appointment.client = client.username
//     // Who is assigned to which appointment?
//     const { data: assignedUser } = await supabase.from('users').select(`*`).eq('id', appointment.assigned_to).single()
//     if (assignedUser) appointment.assignedUser = assignedUser.username
//   }

//   return {
//     props: { appointments },
//   }
// }

export default Dashoard
