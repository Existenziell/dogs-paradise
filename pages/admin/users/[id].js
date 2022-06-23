import { supabase } from '../../../lib/supabase'
import { useEffect, useState } from 'react'
import { PhotographIcon } from '@heroicons/react/solid'
import { getSignedUrl } from '../../../lib/supabase/getSignedUrl'
import Head from 'next/head'
import Link from 'next/link'
import useApp from '../../../context/AppContext'
import Header from '../../../components/Header'
import Auth from '../../../components/Auth'
import Select from 'react-select'
import selectStyles from '../../../lib/selectStyles'

const Users = ({ user, roles }) => {
  const { username, email, created_at, is_premium, avatar_url, quote } = user
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

  function setData(e) {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  function setSelectData(e) {
    setFormData({ ...formData, ...{ role: e.value } })
  }

  const editUser = async () => {
    const { role, is_premium } = formData

    const { error } = await supabase
      .from('users')
      .update({ is_premium, role })
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

      <div className='profile px-8 py-24'>
        <Link href='/admin/users'>
          <a>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 absolute top-24 left-4 text-dark dark:text-white hover:text-brand dark:hover:text-brand hover:scale-105 transition-all rounded " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </a>
        </Link>

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
            <p className=''>Quote: {quote}</p>
            <p>Member since: {created_at.substring(0, 10)}</p>
            <div className='mt-4'>
              <p>Membership Status:</p>
              <div onChange={setData} className='flex gap-2 items-center'>
                <label htmlFor='isPremiumNo' className='cursor-pointer block'>
                  <input
                    type="radio" value="false"
                    name='is_premium'
                    id='isPremiumNo'
                    defaultChecked={!is_premium}
                    className='input'
                  /> Free
                </label>
                <label htmlFor='isPremiumYes' className='cursor-pointer'>
                  <input
                    type="radio" value="true"
                    name='is_premium'
                    id='isPremiumYes'
                    defaultChecked={is_premium}
                    className='input'
                  /> Premium
                </label>
              </div>
            </div>

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
