import { supabase } from '../../../lib/supabase'
import { useEffect, useState } from 'react'
import { CheckIcon } from '@heroicons/react/outline'
import Head from 'next/head'
import useApp from '../../../context/AppContext'
import Header from '../../../components/Header'
import Auth from '../../../components/Auth'
import Select from 'react-select'
import selectStyles from '../../../lib/selectStyles'
import BackBtn from '../../../components/BackBtn'

const Users = ({ user, roles, appointments }) => {
  const { username, email, created_at } = user
  const { session, notify, darkmode } = useApp()
  const [formData, setFormData] = useState({})
  const [styles, setStyles] = useState()

  useEffect(() => {
    const tempStyles = selectStyles(darkmode)
    setStyles(tempStyles)
  }, [darkmode])

  function setSelectData(e) {
    setFormData({ ...formData, ...{ role: e.value } })
  }

  const editUser = async () => {
    const { role } = formData

    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', user.id)

    if (!error) {
      notify("User updated successfully!")
    }
  }

  const roleOptions = []
  roles.forEach(r => {
    roleOptions.push({ value: r.id, label: r.name })
  })

  if (!session) return <Auth />

  return (
    <>
      <Head>
        <title>Admin Users</title>
        <meta name='description' content="Admin Users" />
      </Head>
      <Header content={username} />
      <BackBtn href='/admin/users' />

      <div className='profile px-4 md:px-8 py-24'>
        <div className='flex flex-col justify-center items-center gap-8 text-left'>
          <div className=' flex flex-col gap-1'>
            <p>Email: {email}</p>
            <p>Member since: {created_at.substring(0, 10)}</p>
            <div className='flex items-center gap-2 mt-4'>Role:
              <Select
                options={roleOptions}
                onChange={setSelectData}
                instanceId // Needed to prevent errors being thrown
                defaultValue={roleOptions.filter(o => o.value === user.role)}
                styles={styles}
              />
              <button onClick={editUser} aria-label='Edit User' className='button-secondary w-max'>Save</button>
            </div>
          </div>

          <div>
            <h2>Finished Appointments:</h2>
            {appointments.length ?
              appointments.map(a => (
                <div key={a.id} className='flex flex-wrap justify-between gap-4 mb-4 p-4 bg-white dark:bg-brand-dark rounded-sm'>
                  <div className='text-xs'><h2>Date</h2><p className='text-base'>{a.date}</p></div>
                  <div className='text-xs'><h2>Time</h2><p className='text-base'>{a.time}</p></div>
                  <div className='text-xs'><h2>Service</h2><p className='capitalize text-base'>{a.type.split('-').join(' ')}</p></div>
                  <div className='text-xs'><h2>Client</h2><p className='text-base'>{a.users.username}</p></div>
                  <div className='text-xs'><h2>Dog</h2><p className='text-base'>{a.dogs.name}</p></div>
                  <div className='text-xs'><h2>Pickup</h2><p className='text-base'>{a.service_option ? <CheckIcon className='w-6' /> : `No`}</p></div>
                  <div className='text-xs'><h2>Price</h2><p className='text-base'>{a.price} MXN</p></div>
                </div>
              ))
              :
              <p className='text-xs mt-2'>No finished appointments found for this user.</p>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const id = context.params.id
  const { data: user } = await supabase
    .from('users')
    .select(`*, roles(*), appointments(*)`)
    .eq('id', id)
    .single()

  const { data: appointments } = await supabase
    .from('appointments')
    .select(`*, dogs(*), pickups(*), users!appointments_user_fkey(*)`)
    .eq('assigned_to', id)
    .eq('done', true)

  const { data: roles } = await supabase.from('roles').select(`id, name`).order('id', { ascending: true })

  return {
    props: { user, roles, appointments },
  }
}

export default Users
