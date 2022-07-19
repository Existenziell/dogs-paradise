import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { LinkIcon, CheckIcon, XIcon, BadgeCheckIcon } from '@heroicons/react/solid'
import Head from 'next/head'
import Link from 'next/link'
import useApp from '../../../context/AppContext'
import langEN from '../../../i18n/en.json'
import langES from '../../../i18n/es.json'
import Header from '../../../components/Header'
import Auth from '../../../components/Auth'
import Avatar from '../../../components/Avatar'
import BackBtn from '../../../components/BackBtn'

const Dogs = ({ dog, i18n }) => {
  const { id, name, age, avatar_url, status_vaccine, status_deworming, status_neuter } = dog
  const { session, notify, userDogs, setUserDogs } = useApp()
  const [publicUrl, setPublicUrl] = useState(null)
  const [showDelete, setShowDelete] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showWormEdit, setShowWormEdit] = useState(false)
  const [statusVaccine, setStatusVaccine] = useState(null)
  const [statusDeworming, setStatusDeworming] = useState(null)
  const [fullyVaccinated, setFullyVaccinated] = useState(false)
  const [fullyDewormed, setFullyDewormed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setStatusVaccine(status_vaccine)
    let check = true
    for (let v of status_vaccine) {
      if (!v.status) check = false
    }
    setFullyVaccinated(check)
  }, [status_vaccine])

  useEffect(() => {
    setStatusDeworming(status_deworming)
    let check = true
    for (let v of status_deworming) {
      if (!v.status) check = false
    }
    setFullyDewormed(check)
  }, [status_deworming])

  useEffect(() => {
    if (avatar_url) {
      setPublicUrl(avatar_url)
    }
  }, [avatar_url])

  const handleUpload = async (url) => {
    await supabase.from('dogs').update({ avatar_url: url }).eq('id', id)
    setPublicUrl(url)
  }

  const deleteDog = async (id) => {
    const { error } = await supabase
      .from('dogs')
      .delete()
      .eq('id', id)

    if (!error) {
      const filtered = userDogs.filter(p => (p.id !== id))
      setUserDogs(filtered)
      setShowDelete(false)
      notify("Dog deleted successfully!")
      router.push('/admin/dogs')
    }
  }

  const saveVaccineStatus = async (id) => {
    let status = []
    const rows = document.getElementsByClassName('status-vaccine')
    Array.from(rows).forEach(d => {
      const inputs = Array.from(d.children)
      let el = { [inputs[0].name]: inputs[0].value, [inputs[1].name]: inputs[1].checked, [inputs[2].name]: inputs[2].value }
      status.push(el)
    })

    const { error } = await supabase
      .from('dogs')
      .update({ status_vaccine: status })
      .eq('id', id)

    if (!error) {
      setStatusVaccine(status)
      let check = true
      for (let v of status) {
        if (!v.status) check = false
      }
      setFullyVaccinated(check)
      setShowEdit(false)
    }
  }

  const saveDewormStatus = async (id) => {
    let status = []
    const rows = document.getElementsByClassName('status-deworming')
    Array.from(rows).forEach(d => {
      const inputs = Array.from(d.children)
      let el = { [inputs[0].name]: inputs[0].value, [inputs[1].name]: inputs[1].checked, [inputs[2].name]: inputs[2].value, [inputs[3].name]: inputs[3].value }
      status.push(el)
    })

    const { error } = await supabase
      .from('dogs')
      .update({ status_deworming: status })
      .eq('id', id)

    if (!error) {
      setStatusDeworming(status)
      let check = true
      for (let s of status) {
        if (!s.status) check = false
      }
      setFullyDewormed(check)
      setShowWormEdit(false)
    }
  }

  const updateNeuterStatus = async (e) => {
    const { error } = await supabase
      .from('dogs')
      .update({ status_neuter: e.target.value })
      .eq('id', id)

    if (!error) {
      notify("Dog updated successfully")
    }
  }

  if (!session) return <Auth />

  return (
    <>
      <Head>
        <title>{name} | Edit Dog</title>
        <meta name='description' content={i18n.desc} />
      </Head>
      <Header content={name} />
      <BackBtn href='/admin/dogs' />

      <div className='profile px-4 md:px-8 py-24'>
        <div className='flex flex-col md:flex-row justify-center items-start gap-8'>
          <div className='max-w-xs mb-4'>
            <Avatar
              bucket='dogs'
              url={publicUrl}
              // size={250}
              text='Change picture'
              onUpload={(url) => {
                handleUpload(url)
              }}
            />
            <div className='flex flex-col items-start mt-8'>
              <div className='flex gap-2'>
                <span>Owner:{` `}</span>
                <Link href={`/admin/users/${dog.user.id}`}>
                  <a className='flex items-center justify-center gap-1'>
                    <LinkIcon className='w-4' />{dog.user.username}
                  </a>
                </Link>
              </div>
              <p>Age: {age}</p>
            </div>
          </div>

          <div className='text-left'>
            <div className='flex flex-col'>
              <div className='flex items-center'>
                <h2 className='text-xl my-4'>Vaccines</h2>
                {fullyVaccinated
                  ? <BadgeCheckIcon className='w-8 ml-2 text-brand inline-block' />
                  : <XIcon className='w-8 ml-2 text-red-600 inline-block' />
                }
              </div>

              <div className='flex items-start justify-between gap-4'>
                <div>
                  {statusVaccine?.map(vaccine => {
                    return (
                      <div className='text-sm mb-2' key={vaccine.name}>
                        {!showEdit ?
                          <>
                            <div className='flex items-center gap-2'>
                              <p className='font-bold'>{vaccine.name}</p>

                              {vaccine.status ?
                                <>
                                  <CheckIcon className='w-4 text-brand' />
                                  <p>(expires: {vaccine.expires})</p>
                                </>
                                :
                                <XIcon className='w-4 text-red-600' />
                              }
                            </div>
                          </>
                          :
                          <div className='flex gap-2 status-vaccine'>
                            <input type='text' name='name' disabled className='font-bold bg-transparent border-none' defaultValue={vaccine.name} />
                            <input type='checkbox' name='status' placeholder='true/false' className='font-bold' defaultChecked={vaccine.status ? `checked` : ``} />
                            <input type='text' name='expires' placeholder='expires at' className='font-bold' defaultValue={vaccine.expires} />
                          </div>
                        }
                      </div>
                    )
                  })}
                  {!showEdit ?
                    <button className='button-secondary mt-2' onClick={() => setShowEdit(true)}>Edit</button>
                    :
                    <div className='flex gap-4 mt-2'>
                      <button className='button-secondary' onClick={() => setShowEdit(false)}>Cancel</button>
                      <button className='button-secondary' onClick={() => saveVaccineStatus(id)}>Save</button>
                    </div>
                  }
                </div>
              </div>

              <div className='flex items-center mt-12 mb-4'>
                <h2 className='text-xl'>Deworming</h2>
                {fullyDewormed
                  ? <BadgeCheckIcon className='w-8 ml-2 text-brand' />
                  : <XIcon className='w-8 ml-2 text-red-600' />
                }
              </div>

              <div className='flex items-start justify-between gap-2 mb-8'>
                <div>
                  {statusDeworming?.map(deworm => {
                    return (
                      <div className='text-sm' key={deworm.type}>

                        {!showWormEdit ?
                          <div className='flex items-center gap-2'>
                            {deworm.type}:
                            {deworm.status ?
                              <>
                                <CheckIcon className='w-4 text-brand' />
                                <p>Product: {deworm.product}</p>
                                <p>(expires: {deworm.expires})</p>
                              </>
                              :
                              <XIcon className='w-4 text-red-600' />
                            }
                          </div>
                          :
                          <div className='flex gap-2 status-deworming'>
                            <input type='text' name='type' disabled className='bg-transparent border-none w-20' defaultValue={deworm.type} />
                            <input type='checkbox' name='status' placeholder='true/false' className='font-bold' defaultChecked={deworm.status ? `checked` : ``} />
                            <input type='text' name='product' placeholder='Product' defaultValue={deworm.product} />
                            <input type='text' name='expires' placeholder='expires at' defaultValue={deworm.expires} />
                            {/* <input type='text' name='status' placeholder='true/false' defaultValue={deworm.status.toString()} /> */}
                          </div>
                        }
                      </div>
                    )
                  })}
                  {!showWormEdit ?
                    <button className='button-secondary mt-2' onClick={() => setShowWormEdit(true)}>Edit</button>
                    :
                    <div className='flex gap-4 mt-2'>
                      <button className='button-secondary' onClick={() => setShowWormEdit(false)}>Cancel</button>
                      <button className='button-secondary' onClick={() => saveDewormStatus(id)}>Save</button>
                    </div>
                  }
                </div>
              </div>

              <div className='mt-4'>
                Neutered?
                <label htmlFor='neuteredYes' className='cursor-pointer ml-4 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  <input
                    type="radio"
                    name='neutered'
                    id='neuteredYes'
                    defaultChecked={status_neuter}
                    value="true"
                    onChange={updateNeuterStatus}
                  /> Yes
                </label>
                <label htmlFor='neuteredNo' className='cursor-pointer ml-4 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  <input
                    type="radio"
                    name='neutered'
                    id='neuteredNo'
                    defaultChecked={!status_neuter}
                    value="false"
                    onChange={updateNeuterStatus}
                  /> No
                </label>
              </div>

              <div className='mt-8'>
                <button onClick={() => setShowDelete(true)} aria-label='Toggle Delete Modal' className='flex flex-row items-center justify-center gap-2'>
                  <span className='hover:text-brand'>Delete Dog</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-dark dark:text-white hover:text-brand hover:dark:text-brand hover:scale-110 transition-all cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

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

export async function getServerSideProps(context) {
  const id = context.params.id
  let { data: dog } = await supabase
    .from('dogs')
    .select(`*, user(*)`)
    .eq('id', id)
    .single()

  let i18n
  context.locale === 'en' ?
    i18n = langEN.dogs :
    i18n = langES.dogs

  return {
    props: { dog, i18n },
  }
}

export default Dogs
