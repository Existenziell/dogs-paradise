import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import useApp from '../../../context/AppContext'
import Head from 'next/head'
import Nav from '../../../components/admin/Nav'
import Auth from '../../../components/Auth'
import Link from 'next/link'
import { CheckIcon, PencilAltIcon, XCircleIcon } from '@heroicons/react/outline'
import Search from '../../../components/admin/Search'

const Appointments = ({ appointments }) => {
  const { notify, session } = useApp()
  const [fetchedAppointments, setFetchedAppointments] = useState()
  const [filteredAppointments, setFilteredAppointments] = useState()
  const [showDelete, setShowDelete] = useState(false)
  const [appointmentToDelete, setAppointmentToDelete] = useState()
  const [search, setSearch] = useState('')

  useEffect(() => {
    setFetchedAppointments(appointments)
    setFilteredAppointments(appointments)
  }, [appointments])

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
        const filtered = appointments.filter(c => { return c.id !== appointmentToDelete.id })
        setFetchedAppointments(filtered)
        setFilteredAppointments(filtered)
      } else {
        notify("Appointment cannot be deleted.")
      }
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (fetchedAppointments) {
      if (search === '') resetSearch()
      let appointments = fetchedAppointments.filter(a => (
        a.dogs.name.toLowerCase().includes(search.toLowerCase()) ||
        a.type.toLowerCase().includes(search.toLowerCase()) ||
        a.extras?.toLowerCase().includes(search.toLowerCase()) ||
        a.client.toLowerCase().includes(search.toLowerCase())
      ))
      setFilteredAppointments(appointments)
    }
  }, [search])
  /* eslint-enable react-hooks/exhaustive-deps */

  const resetSearch = () => {
    setFilteredAppointments(fetchedAppointments)
    setSearch('')
  }

  if (!session) return <Auth />

  return (
    <>
      <Head >
        <title>Admin | Appointments | Dog&apos;s Paradise</title>
        <meta name='description' content='Admin Dogs | Dog&apos;s Paradise' />
      </Head>

      <div className='py-16 admin'>
        <Nav />
        <div className='py-8 px-8 text-left'>
          <div className='flex justify-between items-center mb-1'>
            <h1 className='admin-table-title'>Appointments</h1>
            <Search search={search} setSearch={setSearch} resetSearch={resetSearch} />
          </div>
          <table className='admin-table'>
            <thead>
              <tr className='admin-table-header'>
                <th>Date</th>
                <th>Time</th>
                <th>Service</th>
                <th>Client</th>
                <th>Dog</th>
                <th>Delivery/Pickup</th>
                {/* <th>Assigned</th> */}
                <th>Extras</th>
                <th>Price</th>
                <th>Done</th>
                <th>View</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>

              {!fetchedAppointments?.length &&
                <tr className='p-4'><td>No appointments found.</td></tr>
              }

              {filteredAppointments?.map((appointment) => {
                const { id, date, time, type, done, client, dogs, service_option, extras, price } = appointment
                return (
                  <tr key={id} className={`${done && `bg-brand/20 dark:bg-brand-dark`} relative whitespace-nowrap`}>
                    <td>{date}</td>
                    <td>{time}</td>
                    <td className='capitalize'>{type.split('-').join(' ')}</td>
                    <td>{client}</td>
                    <td>{dogs.name}</td>
                    <td>{service_option ? <CheckIcon className='w-6' /> : `No`}</td>
                    {/* <td>{assignedUser}</td> */}
                    <td className=' whitespace-normal'>{extras}</td>
                    <td>{price} MXN</td>
                    <td>{done ? <CheckIcon className='w-6' /> : `No`}</td>
                    <td>
                      <Link href={`/admin/appointments/${id}`}>
                        <a>
                          <PencilAltIcon className='h-5 w-5 text-brand-dark hover:text-brand dark:hover:text-brand hover:scale-110 transition-all cursor-pointer dark:invert dark:hover:invert-0' />
                        </a>
                      </Link>
                    </td>
                    <td className='text-center align-middle'>
                      <button onClick={() => toggleDeleteModal(appointment)} aria-label='Toggle Delete Modal'>
                        <XCircleIcon className='h-5 w-5 text-brand-dark hover:text-brand dark:hover:text-brand hover:scale-110 transition-all cursor-pointer dark:invert dark:hover:invert-0' />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Delete appointment */}
          {showDelete &&
            <div className='fixed top-0 bottom-0 left-0 right-0 z-20 text-lg '>
              <div className='w-full h-full bg-black/80 flex items-center justify-center'>
                <div className='flex flex-col items-center justify-center backdrop-blur-lg bg-white text-brand-dark rounded p-12'>
                  <button onClick={() => setShowDelete(false)} className='absolute top-0 right-0 px-2 py-0 rounded-sm hover:text-brand text-2xl hover:bg-gray-100' aria-label='Close Delete Dialog'>
                    &times;
                  </button>
                  <p className='text-sm'>Deleting appointment for client {appointmentToDelete.client} at date {appointmentToDelete.date}</p>
                  <p className='text-2xl mt-6'>Are you sure?</p>
                  <div className='flex items-center gap-4 mt-6'>
                    <button onClick={() => setShowDelete(false)} className='button-secondary' aria-label='Cancel'>Cancel</button>
                    <button onClick={deleteAppointment} className='button-secondary' aria-label='Yes'>Yes</button>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const { data: appointments } = await supabase
    .from('appointments')
    .select(`*, dogs(*)`)
    .order('date', { ascending: false })
    .order('time', { ascending: false })

  // Gather additional information from user
  for (const appointment of appointments) {
    // Who is the client asking for this appointment?
    const { data: client } = await supabase.from('users').select(`*`).eq('id', appointment.user).single()
    appointment.client = client.username
    // Who is assigned to which appointment?
    const { data: assignedUser } = await supabase.from('users').select(`*`).eq('id', appointment.assigned_to).single()
    if (assignedUser) appointment.assignedUser = assignedUser.username
  }

  return {
    props: { appointments },
  }
}

export default Appointments
