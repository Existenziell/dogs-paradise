import { useState, useEffect, useContext } from 'react'
import { supabase } from '../../lib/supabase'
import { AppContext } from '../../context/AppContext'
import Head from 'next/head'
import Router, { useRouter } from 'next/router'
import Header from '../../components/Header'
import langEN from '../../i18n/en.json'
import langES from '../../i18n/es.json'
import Link from 'next/link'

const AddDog = ({ i18n }) => {
  const appCtx = useContext(AppContext)
  const { currentUser, notify, userPets, setUserPets } = appCtx
  const [formData, setFormData] = useState({})
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
        birthdate: formData.birthdate,
        user: currentUser.id
      })
    if (!error) {
      const newPet = data[0]
      setUserPets([...userPets, newPet])
      notify("Dog added successfully!")
      router.push('/')
    }
  }

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>
      <Header content={i18n.T1} />

      <Link href='/'>
        <a>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 absolute top-24 left-4 text-slate-600 hover:bg-white hover:text-black hover:scale-105 transition-all rounded " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </a>
      </Link>

      <div className='px-8 py-24 flex flex-col profile items-center justify-center'>
        <form onSubmit={addDog} className='shadow max-w-max bg-white dark:bg-transparent p-4 text-left rounded' id='addDogForm' >
          Name <input type='text' name='name' id='name' placeholder='Lucy' onChange={setData} required className='block mb-2' />
          Status <input type='text' name='status' id='status' placeholder='Needs Deworming' onChange={setData} className='block mb-2' />
          Birthdate <input type='text' name='birthdate' id='birthdate' placeholder='2018-04-19' onChange={setData} className='block mb-2' />
          <input type='submit' className='button cursor-pointer block mt-6' value='Save' />
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
