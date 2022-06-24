import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import Head from 'next/head'
import Link from 'next/link'
import useApp from '../../../context/AppContext'
import Nav from '../../../components/admin/Nav'
import Auth from '../../../components/Auth'
import { PencilAltIcon, XCircleIcon } from '@heroicons/react/outline'

const Users = ({ users, roles }) => {
  const [fetchedUsers, setFetchedUsers] = useState()
  const [filteredUsers, setFilteredUsers] = useState()
  const [search, setSearch] = useState('')
  const { session } = useApp()

  useEffect(() => {
    setFetchedUsers(users)
    setFilteredUsers(users)
  }, [users])

  let roleOptions = []
  roles.forEach(r => {
    roleOptions.push({ value: r.id, label: r.name })
  })

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (fetchedUsers) {
      if (search === '') resetSearch()
      let users = fetchedUsers.filter(a => (
        a.username.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase()) ||
        a.roles.name.toLowerCase().includes(search.toLowerCase())
      ))
      setFilteredUsers(users)
    }
  }, [search])
  /* eslint-enable react-hooks/exhaustive-deps */

  const resetSearch = () => {
    setFilteredUsers(fetchedUsers)
    setSearch('')
  }

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
          <div className='flex justify-between items-center mb-1'>

            <h1 className='admin-table-title'>Users</h1>
            <div className='relative'>
              <input type='text' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search' name='search' className='ml-2' />
              <button onClick={resetSearch} className=' absolute top-3 right-2 hover:text-brand'>
                <XCircleIcon className='w-5' />
              </button>
            </div>
          </div>
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
              {!fetchedUsers?.length || !filteredUsers?.length &&
                <tr className='p-4'><td>No users found.</td></tr>
              }

              {filteredUsers?.map((user) => (
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
                        <PencilAltIcon className='h-5 w-5 text-brand-dark hover:text-brand dark:hover:text-brand hover:scale-110 transition-all cursor-pointer dark:invert dark:hover:invert-0' />
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
