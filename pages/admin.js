import { useContext } from 'react'
import { supabase } from '../lib/supabase'
import { AppContext } from '../context/AppContext'
import Head from 'next/head'
import Users from '../components/admin/Users'
import Dogs from '../components/admin/Dogs'
import SupaAuth from '../components/SupaAuth'

const Admin = ({ users, dogs, roles }) => {
  const appCtx = useContext(AppContext)
  const { session, currentUser } = appCtx

  if (!session || !currentUser) return <SupaAuth />
  if (currentUser?.roles?.name !== 'Admin') return <SupaAuth />

  return (
    <>
      <Head>
        <title>Admin | Dog's Paradise</title>
        <meta name='description' content="Admin | Dog's Paradise" />
      </Head>

      <div className='py-16 admin'>
        <h1 className='text-4xl mt-8'>Admin Control</h1>
        <p className='py-4'>Always remember, with great power comes great responsibility.</p>
        <Users users={users} roles={roles} />
        <Dogs dogs={dogs} users={users} />
      </div>
    </>
  )
}

export async function getServerSideProps({ req, res }) {
  const { data: users } = await supabase.from('users').select(`*, dogs(name), roles(*)`).order('id', { ascending: true })
  const { data: dogs } = await supabase.from('dogs').select(`*, user(*)`).order('id', { ascending: true })
  const { data: roles } = await supabase.from('roles').select(`id, name`).order('id', { ascending: true })

  return {
    props: { users, dogs, roles },
  }
}

export default Admin
