import Head from 'next/head'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'

import { useEffect, useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { supabase } from '../../lib/supabase'
import updateProfile from '../../lib/updateProfile'
import langEN from '../../i18n/en.json'
import langES from '../../i18n/es.json'
import Header from '../../components/Header'
import Auth from '../../components/Auth'

const Pets = ({ data, i18n }) => {
  const { id, name, status, birthdate } = data

  const appCtx = useContext(AppContext)
  const { session, notify, currentUser, userPets, setUserPets } = appCtx
  const router = useRouter()

  const [showDelete, setShowDelete] = useState(false)

  const deleteDog = async (id) => {
    const { error } = await supabase
      .from('dogs')
      .delete()
      .eq('id', id)


    if (!error) {
      const filtered = userPets.filter(p => (p.id !== id))
      setUserPets(filtered)
      setShowDelete(false)
      notify("Dog deleted successfully!")
      router.push('/')
    }
  }

  if (!session) return <Auth />

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>

      <Header content={name} />

      <div className='profile px-8 py-24'>
        <div className='flex justify-center items-center gap-4'>
          <img src='/icons/services/pickup.png' alt='Dog' className='w-64' />
          <div className='text-left'>
            <p>Born: {birthdate}</p>
            <p>Status: {status}</p>
            <p className='mt-6 flex items-center'>Checklist:
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 inline-block text-green-700 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </p>
            <button onClick={() => setShowDelete(true)} aria-label='Toggle Delete Modal' className='flex items-center gap-2 justify-center'>
              Delete Pet
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-dark hover:text-brand hover:scale-110 transition-all cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* <pre className='text-left text-xs'>{JSON.stringify(data, null, 2)}</pre> */}

        {/* Delete Dog Modal */}
        {showDelete &&
          <div className='fixed top-0 bottom-0 left-0 right-0 z-20 text-lg '>
            <div className='w-full h-full bg-black/80 flex items-center justify-center'>
              <div className='flex flex-col items-center justify-center backdrop-blur-lg bg-white text-brand-dark rounded p-12'>
                <button
                  onClick={() => setShowDelete(false)}
                  className='absolute top-0 right-0 px-2 py-0 rounded-sm hover:text-brand text-2xl hover:bg-gray-100'
                  aria-label='Close Delete Modal'
                >
                  &times;
                </button>
                <p className='text-sm'>Deleting {name}</p>
                <p className='text-2xl mt-2'>Are you sure?</p>
                <div className='flex items-center gap-4 mt-6'>
                  <button onClick={() => setShowDelete(false)} className='hover:text-brand hover:underline' aria-label='Cancel'>Cancel</button>
                  <button onClick={() => deleteDog(id)} className='hover:text-brand hover:underline' aria-label='Delete Dog'>Yes</button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </>
  )
}

export async function getStaticProps(context) {
  const id = context.params.id
  let { data, error } = await supabase
    .from('dogs')
    .select(`*, user(*)`)
    .eq('id', id)
    .single()

  let i18n
  context.locale === 'en' ?
    i18n = langEN.pets :
    i18n = langES.pets

  return {
    props: { data, i18n },
  }
}

export async function getStaticPaths(context) {
  let { data, error, status } = await supabase
    .from('dogs')
    .select(`*, user(*)`)

  const paths = data.map(d => ({
    params: { id: d.id.toString() },
  }))

  return { paths, fallback: false }
}

export default Pets
