import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Head from 'next/head'
import Users from '../components/admin/Users'
import Dogs from '../components/admin/Dogs'
import Auth from '../components/Auth'

const Admin = ({ users, dogs, roles }) => {
  const [user, setUser] = useState()

  useEffect(() => {
    auth()
  }, [])

  const auth = async () => {
    const user = await supabase.auth.user()
    setUser(user)
  }

  if (!user) return <Auth />

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
  const { data: users } = await supabase.from('users').select(`*, dogs(name), roles(name)`).order('id', { ascending: true })
  const { data: dogs } = await supabase.from('dogs').select(`*, user(*)`).order('id', { ascending: true })
  const { data: roles } = await supabase.from('roles').select(`id, name`).order('id', { ascending: true })

  return {
    props: { users, dogs, roles },
  }
}

export default Admin
