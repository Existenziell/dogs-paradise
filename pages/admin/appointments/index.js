import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import useApp from '../../../context/AppContext'
import Head from 'next/head'
import Nav from '../../../components/admin/Nav'

const Appointments = ({ appointments }) => {
  const { notify } = useApp()
  const [fetchedAppointments, setFetchedAppointments] = useState()
  const [showDelete, setShowDelete] = useState(false)
  const [appointmentToDelete, setAppointmentToDelete] = useState()

  useEffect(() => {
    setFetchedAppointments(appointments)
  }, [appointments])

  const toggleDeleteModal = (id) => {
    setAppointmentToDelete(id)
    setShowDelete(true)
  }

  const deleteAppointment = async () => {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentToDelete)

    if (!error) {
      notify("Appointment deleted successfully!")
      setShowDelete(false)
      const filteredAppointments = appointments.filter(c => { return c.id !== appointmentToDelete })
      setFetchedAppointments(filteredAppointments)
    } else {
      notify("Appointment cannot be deleted, because they have active dogs")
    }
  }

  return (
    <>
      <Head >
        <title>Admin Dogs | Dog&apos;s Paradise</title>
        <meta name='description' content='Admin Dogs | Dog&apos;s Paradise' />
      </Head>

      <div className='py-16 admin'>
        <Nav />
        <div className='py-8 px-8 text-left'>
          <h1 className='admin-table-title'>Appointments</h1>

          <table className='admin-table'>
            <thead>
              <tr className='admin-table-header'>
                <th>Created</th>
                <th>Client</th>
                <th>Dog</th>
                <th>Type</th>
                <th>Date</th>
                <th>Time</th>
                <th>Service?</th>
                <th>Assigned</th>
                <th>Done</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>

              {!fetchedAppointments &&
                <tr className='p-4'><td>No appointments found.</td></tr>
              }

              {fetchedAppointments?.map((appointment, idx) => (
                <tr key={appointment.id} className={`relative anchor ${idx % 2 !== 0 && `bg-slate-100`}`}>
                  <td>{appointment.created_at.substring(0, 10)}</td>
                  <td>{appointment.users.username}</td>
                  <td>{appointment.dogs.name}</td>
                  <td>{appointment.type}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.service_option.toString()}</td>
                  <td>{appointment.assignedUser}</td>
                  <td>{appointment.done.toString()}</td>
                  <td className='text-center align-middle'>
                    <button onClick={() => toggleDeleteModal(appointment.id)} aria-label='Toggle Delete Modal'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-dark hover:text-brand hover:scale-110 transition-all cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
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
                  <p className='text-sm'>Deleting appointment with ID {appointmentToDelete}</p>
                  <p className='text-2xl mt-2'>Are you sure?</p>
                  <div className='flex items-center gap-4 mt-6'>
                    <button onClick={() => setShowDelete(false)} className='hover:text-brand hover:underline' aria-label='Cancel'>Cancel</button>
                    <button onClick={deleteAppointment} className='hover:text-brand hover:underline' aria-label='Yes'>Yes</button>
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
  const { data: appointments } = await supabase.from('appointments').select(`*, users(*), dogs(*)`).order('created_at', { ascending: true })

  // Who is assigned to which appointment?
  for (const appointment of appointments) {
    const { data: assignedUser } = await supabase.from('users').select(`*`).eq('id', appointment.assigned_to).single()
    if (assignedUser) appointment.assignedUser = assignedUser.username
  }

  return {
    props: { appointments },
  }
}

export default Appointments
