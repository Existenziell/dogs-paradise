import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import useApp from '../../context/AppContext'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../../components/Header'
import langEN from '../../i18n/en.json'
import langES from '../../i18n/es.json'
import Link from 'next/link'
import Avatar from '../../components/Avatar'
import Auth from '../../components/Auth'

const AddDog = ({ i18n }) => {
  const { session, currentUser, notify, userPets, setUserPets } = useApp()
  const [formData, setFormData] = useState({})
  const [avatar_url, setAvatarUrl] = useState(null)
  const router = useRouter()

  function setData(e) {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  const addDog = async (e) => {
    e.preventDefault()

    const { data, error } = await supabase
      .from('dogs')
      .insert({
        name: formData.name,
        status: formData.status,
        age: formData.age,
        user: currentUser.id,
        avatar_url: avatar_url,
      })
    if (!error) {
      const newPet = data[0]
      setUserPets([...userPets, newPet])
      notify("Dog added successfully!")
      router.push('/profile')
    }
  }

  if (!session) return <Auth />

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>
      <Header content={i18n.T1} />

      <Link href='/profile'>
        <a>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 absolute top-24 left-4 text-dark dark:text-white hover:text-brand dark:hover:text-brand hover:scale-105 transition-all rounded " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </a>
      </Link>

      <div className='px-8 py-24 flex flex-col add-dog items-center justify-center h-screen'>
        <form onSubmit={addDog} className='shadow max-w-max bg-white dark:bg-transparent px-8 py-6 text-left rounded' id='addDogForm' >
          <div className='max-w-xs mb-4'>
            <Avatar
              bucket='dogs'
              url={avatar_url}
              // size={150}
              text='Upload picture'
              onUpload={(url) => { setAvatarUrl(url) }}
            />
          </div>
          Name <input type='text' name='name' id='name' placeholder='Lucy' onChange={setData} required className='block mb-2' />
          Status <input type='text' name='status' id='status' placeholder='Needs Deworming' onChange={setData} className='block mb-2' />
          Age <input type='number' min={1} max={100} name='age' id='age' placeholder='4' onChange={setData} className='block mb-2 w-full' />
          <input type='submit' className='button cursor-pointer block mt-8' value='Save' />
        </form>
      </div>
    </>
  )
}

export async function getStaticProps(context) {
  let i18n
  context.locale === 'en' ?
    i18n = langEN.addPet :
    i18n = langES.addPet
  return {
    props: { i18n },
  }
}

export default AddDog
