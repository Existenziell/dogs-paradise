import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import Head from 'next/head'
import Link from 'next/link'
import useApp from '../../../context/AppContext'
import Nav from '../../../components/admin/Nav'
import Auth from '../../../components/Auth'

const Users = ({ users, roles }) => {
  const [fetchedUsers, setFetchedUsers] = useState()
  const { session } = useApp()

  useEffect(() => {
    setFetchedUsers(users)
  }, [users])

  let roleOptions = []
  roles.forEach(r => {
    roleOptions.push({ value: r.id, label: r.name })
  })

  if (!session) return <Auth />

  return (
    <>
      <Head>
        <title>Admin | Dog&apos;s Paradise</title>
        <meta name='description' content='Admin | Dog&apos;s Paradise' />
      </Head >
      <div className='py-16 admin'>
        <Nav />
        <div className='py-8 px-8 text-left'>
          <h1 className='admin-table-title'>Users</h1>

          <table className='admin-table'>
            <thead>
              <tr className='admin-table-header'>
                <th>Username</th>
                <th>Email</th>
                <th>Dogs</th>
                <th>Membership</th>
                <th>Role</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>

              {!fetchedUsers?.length &&
                <tr className='p-4'><td>No users found.</td></tr>
              }

              {fetchedUsers?.map((user) => (
                <tr key={user.id + user.username} className='relative'>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    {user?.dogs?.map(d => (
                      <span key={`${d.name}-${user.id}`} className='mr-2'>{d.name}</span>
                    ))}
                  </td>
                  <td>{user.is_premium ? `Premium` : `Free`}</td>
                  <td>{user.roles.name}</td>
                  <td>
                    <Link href={`/admin/users/${user.id}`}>
                      <a>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-dark hover:text-slate-500 hover:scale-110 transition-all cursor-pointer pointer-events-none dark:invert" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                          <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const { data: users } = await supabase.from('users').select(`*, roles(*)`).order('id', { ascending: true })
  const { data: roles } = await supabase.from('roles').select(`id, name`).order('id', { ascending: true })

  // Gather dogs for each user
  for (const user of users) {
    const { data: userDogs } = await supabase.from('dogs').select(`*`).eq('user', user.id)
    user.dogs = userDogs
  }

  return {
    props: { users, roles },
  }
}

export default Users
