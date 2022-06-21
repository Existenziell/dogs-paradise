import { supabase } from '../../lib/supabase'
import useApp from '../../context/AppContext'
import Head from 'next/head'
import Users from '../../components/admin/Users'
import Dogs from '../../components/admin/Dogs'
import Auth from '../../components/Auth'
import Appointments from '../../components/admin/Appointments'
import Nav from '../../components/admin/Nav'

const Admin = ({ users, dogs, roles, appointments }) => {
  const { session, currentUser } = useApp()

  if (!session || !currentUser) return <Auth />
  if (currentUser?.roles?.name !== 'Admin') return <Auth />

  return (
    <>
      <Head>
        <title>Admin | Dog&apos;s Paradise</title>
        <meta name='description' content='Admin | Dog&apos;s Paradise' />
      </Head>

      <div className='py-16 admin'>
        <Nav />
        <h1 className='text-4xl mt-8'>Admin Control</h1>
        <p className='text-sm mt-2'>Remember, with great power comes great responsibility.</p>

        <Appointments appointments={appointments} />
        <Users users={users} dogs={dogs} roles={roles} />
        <Dogs dogs={dogs} users={users} />
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const { data: users } = await supabase.from('users').select(`*, roles(*)`).order('id', { ascending: true })
  const { data: dogs } = await supabase.from('dogs').select(`*, user(*)`).order('id', { ascending: true })
  const { data: roles } = await supabase.from('roles').select(`id, name`).order('id', { ascending: true })
  const { data: appointments } = await supabase.from('appointments').select(`*, users(*), dogs(*)`).order('id', { ascending: true })

  // Gather dogs for each user
  for (const user of users) {
    const { data: userDogs } = await supabase.from('dogs').select(`*`).eq('user', user.id)
    user.dogs = userDogs
  }

  // Who is assigned to which appointment?
  for (const appointment of appointments) {
    const { data: assignedUser } = await supabase.from('users').select(`*`).eq('id', appointment.assigned_to).single()
    if (assignedUser) appointment.assignedUser = assignedUser.username
  }

  return {
    props: { users, dogs, roles, appointments },
  }
}

export default Admin
