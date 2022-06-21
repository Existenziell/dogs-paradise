import { supabase } from '../../../lib/supabase'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import useApp from '../../../context/AppContext'
import Header from '../../../components/Header'
import Auth from '../../../components/Auth'
import { PhotographIcon } from '@heroicons/react/solid'
import { getSignedUrl } from '../../../lib/supabase/getSignedUrl'

const Users = ({ user }) => {
  const { username, email, created_at, is_premium, avatar_url, quote } = user
  const { session } = useApp()
  const [publicUrl, setPublicUrl] = useState(null)

  useEffect(() => {
    if (avatar_url) {
      fetchPicture()
    }
  })

  const fetchPicture = async () => {
    const url = await getSignedUrl('avatars', avatar_url)
    setPublicUrl(url)
  }

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
          <div className='text-left'>
            <p>Email: {email}</p>
            <p>Role: {user.roles.name}</p>
            <p className='my-2'>Quote: {quote}</p>
            <p>Member since: {created_at.substring(0, 10)}</p>
            <p>Membership Status: {is_premium ? `Premium` : `Free`}</p>
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

  return {
    props: { user },
  }
}

export default Users
