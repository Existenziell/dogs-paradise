import { supabase } from '../../../lib/supabase'
import { useEffect, useState } from 'react'
import { PhotographIcon } from '@heroicons/react/solid'
import { getSignedUrl } from '../../../lib/supabase/getSignedUrl'
import Head from 'next/head'
import useApp from '../../../context/AppContext'
import Header from '../../../components/Header'
import Auth from '../../../components/Auth'
import Select from 'react-select'
import selectStyles from '../../../lib/selectStyles'
import BackBtn from '../../../components/BackBtn'

const Users = ({ user, roles }) => {
  const { username, email, created_at, avatar_url, quote } = user
  const { session, notify, darkmode } = useApp()
  const [publicUrl, setPublicUrl] = useState(null)
  const [formData, setFormData] = useState({})
  const [styles, setStyles] = useState()

  useEffect(() => {
    if (avatar_url) {
      fetchPicture()
    }
  })

  useEffect(() => {
    let tempStyles = selectStyles(darkmode)
    setStyles(tempStyles)
  }, [darkmode])

  const fetchPicture = async () => {
    const url = await getSignedUrl('avatars', avatar_url)
    setPublicUrl(url)
  }

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

  let roleOptions = []
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
        <div className='flex flex-col md:flex-row justify-center items-start gap-8'>
          <div className='max-w-xs mb-4'>
            {publicUrl ?
              <img src={publicUrl} alt='user Image' className='shadow rounded-sm' />
              :
              <>
                <PhotographIcon className='w-32' />
              </>
            }
          </div>
          <div className='text-left flex flex-col gap-1'>
            <p>Email: {email}</p>
            <p>Quote: {quote}</p>
            <p>Member since: {created_at.substring(0, 10)}</p>

            <div className='flex items-center gap-2 mt-4'>Role:
              <Select
                options={roleOptions}
                onChange={setSelectData}
                instanceId // Needed to prevent errors being thrown
                defaultValue={roleOptions.filter(o => o.value === user.role)}
                styles={styles}
              />
            </div>
            <button onClick={editUser} aria-label='Edit User' className='button-secondary mt-4 w-max'>Save</button>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const id = context.params.id
  let { data: user } = await supabase
    .from('users')
    .select(`*, roles(*)`)
    .eq('id', id)
    .single()

  const { data: roles } = await supabase.from('roles').select(`id, name`).order('id', { ascending: true })


  return {
    props: { user, roles },
  }
}

export default Users
