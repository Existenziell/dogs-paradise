import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/router'
import useApp from '../../context/AppContext'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../../components/Header'
import langEN from '../../i18n/en.json'
import langES from '../../i18n/es.json'
import Avatar from '../../components/Avatar'
import Auth from '../../components/Auth'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const AddDog = ({ i18n }) => {
  const { session, currentUser, notify, userDogs, setUserDogs } = useApp()
  const [formData, setFormData] = useState({})
  const [avatar_url, setAvatarUrl] = useState(null)
  const router = useRouter()

  const [date1, setDate1] = useState(new Date())
  const [date2, setDate2] = useState(new Date())
  const [date3, setDate3] = useState(new Date())
  const [date4, setDate4] = useState(new Date())
  const [date5, setDate5] = useState(new Date())
  const [date6, setDate6] = useState(new Date())
  const [date7, setDate7] = useState(new Date())
  const [dateDeworm1, setDateDeworm1] = useState(new Date())
  const [dateDeworm2, setDateDeworm2] = useState(new Date())

  function setData(e) {
    const { name, value, checked, type } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
    if (type === 'checkbox') setFormData({ ...formData, ...{ [name]: checked } })
  }

  const addDog = async (e) => {
    e.preventDefault()

    const statusVaccine = [
      { name: "Leptospirosis", status: formData[`Leptospirosis`], expires: formData[`Leptospirosis`] ? date1 : `` },
      { name: "Hepatitis", status: formData[`Hepatitis`], expires: formData[`Hepatitis`] ? date2 : `` },
      { name: "Distemper", status: formData[`Distemper`], expires: formData[`Distemper`] ? date3 : `` },
      { name: "Rabies", status: formData[`Rabies`], expires: formData[`Rabies`] ? date4 : `` },
      { name: "Bordetellosis", status: formData[`Bordetellosis`], expires: formData[`Bordetellosis`] ? date5 : `` },
      { name: "Parainfluenza Virus", status: formData[`Parainfluenza Virus`], expires: formData[`Parainfluenza Virus`] ? date6 : `` },
      { name: "Parvo Virus", status: formData[`Parvo Virus`], expires: formData[`Parvo Virus`] ? date7 : `` }
    ]

    const statusDeworming = [
      { type: "internal", product: formData[`internalProduct`], status: formData[`internal`], expires: formData[`internal`] ? dateDeworm1 : `` },
      { type: "external", product: formData[`external`] ? formData[`externalProduct`] : ``, status: formData[`external`], expires: formData[`external`] ? dateDeworm2 : `` }
    ]

    const { data, error } = await supabase
      .from('dogs')
      .insert({
        name: formData.name,
        status_neuter: formData.neutered,
        age: formData.age,
        user: currentUser.id,
        avatar_url,
        status_vaccine: statusVaccine,
        status_deworming: statusDeworming,
        size: formData.size,
        hairlength: formData.hairlength,
      })
    if (!error) {
      const newDog = data[0]
      setUserDogs([...userDogs, newDog])
      notify("Dog added successfully!")
      router.push('/profile')
    }
  }

  if (!session || !currentUser) return <Auth />

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>
      <Header content={i18n.T1} />

      <div className='px-4 md:px-6 py-24 flex flex-col add-dog items-center justify-center w-full'>
        <form onSubmit={addDog} className='shadow w-full bg-white dark:bg-brand-dark px-4 md:px-8 pt-8 pb-4 text-left rounded' id='addDogForm' >
          <div className='flex flex-col md:flex-row md:items-start justify-center gap-12 mb-8'>
            <div className='max-w-xs'>
              <Avatar
                bucket='dogs'
                url={avatar_url}
                // size={250}
                text='Upload picture'
                onUpload={(url) => { setAvatarUrl(url) }}
              />
            </div>
            <div>
              Name <input type='text' name='name' id='name' placeholder='Lucy' onChange={setData} required className='block mb-2 w-full' />
              Age <input type='number' min={1} max={100} name='age' id='age' placeholder='4' onChange={setData} className='block w-full' /></div>

            <div className='flex flex-col gap-6 ml-2'>
              <div>
                <p className='text-xl'>Neutered?</p>
                <label htmlFor='neuteredYes' className='cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-300'>
                  <input
                    type="radio"
                    name='neutered'
                    id='neuteredYes'
                    defaultChecked={false}
                    value="true"
                    onChange={setData}
                  /> Yes
                </label>
                <label htmlFor='neuteredNo' className='cursor-pointer ml-4 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  <input
                    type="radio"
                    name='neutered'
                    id='neuteredNo'
                    defaultChecked={true}
                    value="false"
                    onChange={setData}
                  /> No
                </label>
              </div>

              <div>
                <p className='text-xl'>Size</p>
                <label htmlFor='small' className='cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-300'>
                  <input
                    type="radio"
                    name='size'
                    id='small'
                    defaultChecked={true}
                    value="small"
                    onChange={setData}
                  /> Small
                </label>
                <label htmlFor='medium' className='cursor-pointer ml-4 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  <input
                    type="radio"
                    name='size'
                    id='medium'
                    defaultChecked={false}
                    value="medium"
                    onChange={setData}
                  /> Medium
                </label>
                <label htmlFor='big' className='cursor-pointer ml-4 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  <input
                    type="radio"
                    name='size'
                    id='big'
                    defaultChecked={false}
                    value="big"
                    onChange={setData}
                  /> Big
                </label>
              </div>

              <div>
                <p className='text-xl'>Hair length</p>
                <label htmlFor='short' className='cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-300'>
                  <input
                    type="radio"
                    name='hairlength'
                    id='short'
                    defaultChecked={true}
                    value="short"
                    onChange={setData}
                  /> Short
                </label>
                <label htmlFor='long' className='cursor-pointer ml-4 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  <input
                    type="radio"
                    name='hairlength'
                    id='long'
                    defaultChecked={false}
                    value="long"
                    onChange={setData}
                  /> Long
                </label>
              </div>
            </div>
          </div>

          <div className='flex flex-col xl:flex-row xl:items-start justify-center gap-12 mt-12'>
            <div>
              <p className='text-xl border-b mb-4'>Vaccine Status:</p>
              <div className='text-sm mb-2'>
                <div className='flex flex-wrap md:flex-nowrap items-center md:items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 mb-1'>
                  <input type='text' name='name' disabled className='font-bold bg-transparent border-none inline-block' value='Leptospirosis' />
                  <input type='checkbox' name='Leptospirosis' className='font-bold inline-block' defaultChecked={false} onChange={setData} />
                  <DatePicker selected={date1} onChange={(date) => setDate1(date)} className='px-4 py-2' />
                </div>
                <div className='flex flex-wrap md:flex-nowrap items-center md:items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 mb-1'>
                  <input type='text' name='name' disabled className='font-bold bg-transparent border-none' value='Hepatitis' />
                  <input type='checkbox' name='Hepatitis' className='font-bold' defaultChecked={false} onChange={setData} />
                  <DatePicker selected={date2} onChange={(date) => setDate2(date)} className='px-4 py-2' />
                </div>
                <div className='flex flex-wrap md:flex-nowrap items-center md:items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 mb-1'>
                  <input type='text' name='name' disabled className='font-bold bg-transparent border-none' value='Distemper' />
                  <input type='checkbox' name='Distemper' className='font-bold' defaultChecked={false} onChange={setData} />
                  <DatePicker selected={date3} onChange={(date) => setDate3(date)} className='px-4 py-2' />
                </div>
                <div className='flex flex-wrap md:flex-nowrap items-center md:items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 mb-1'>
                  <input type='text' name='name' disabled className='font-bold bg-transparent border-none' value='Rabies' />
                  <input type='checkbox' name='Rabies' className='font-bold' defaultChecked={false} onChange={setData} />
                  <DatePicker selected={date4} onChange={(date) => setDate4(date)} className='px-4 py-2' />
                </div>
                <div className='flex flex-wrap md:flex-nowrap items-center md:items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 mb-1'>
                  <input type='text' name='name' disabled className='font-bold bg-transparent border-none' value='Bordetellosis' />
                  <input type='checkbox' name='Bordetellosis' className='font-bold' defaultChecked={false} onChange={setData} />
                  <DatePicker selected={date5} onChange={(date) => setDate5(date)} className='px-4 py-2' />
                </div>
                <div className='flex flex-wrap md:flex-nowrap items-center md:items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 mb-1'>
                  <input type='text' name='name' disabled className='font-bold bg-transparent border-none' value='Parainfluenza Virus' />
                  <input type='checkbox' name='Parainfluenza Virus' className='font-bold' defaultChecked={false} onChange={setData} />
                  <DatePicker selected={date6} onChange={(date) => setDate6(date)} className='px-4 py-2' />
                </div>
                <div className='flex flex-wrap md:flex-nowrap items-center md:items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 mb-1'>
                  <input type='text' name='name' disabled className='font-bold bg-transparent border-none' value='Parvo Virus' />
                  <input type='checkbox' name='Parvo Virus' className='font-bold' defaultChecked={false} onChange={setData} />
                  <DatePicker selected={date7} onChange={(date) => setDate7(date)} className='px-4 py-2' />
                </div>
              </div>
            </div>

            <div className=''>
              <p className='text-xl border-b mb-4'>Deworming Status:</p>
              <div className='text-sm mb-2'>
                <div className='flex flex-wrap md:flex-nowrap items-center md:items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 mb-1'>
                  <input type='text' name='type' disabled className='bg-transparent border-none md:w-36' value='internal' />
                  <input type='checkbox' name='internal' placeholder='true/false' className='font-bold' defaultChecked={false} onChange={setData} />
                  <input type='text' name='internalProduct' placeholder='Product' onChange={setData} />
                  <DatePicker selected={dateDeworm1} onChange={(date) => setDateDeworm1(date)} className='px-4 py-2' />
                </div>
                <div className='flex flex-wrap md:flex-nowrap items-center md:items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 mb-1'>
                  <input type='text' name='type' disabled className='bg-transparent border-none md:w-36' value='external' />
                  <input type='checkbox' name='external' placeholder='true/false' className='font-bold' defaultChecked={false} onChange={setData} />
                  <input type='text' name='externalProduct' placeholder='Product' onChange={setData} />
                  <DatePicker selected={dateDeworm2} onChange={(date) => setDateDeworm2(date)} className='px-4 py-2' />
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-center gap-4 w-full'>
            <input type='submit' className='button cursor-pointer my-12' value='Save' />
            <Link href='/profile'><a className='link'>Cancel</a></Link>
          </div>
        </form >
      </div >
    </>
  )
}

export async function getStaticProps(context) {
  let i18n
  context.locale === 'en' ?
    i18n = langEN.addDog :
    i18n = langES.addDog
  return {
    props: { i18n },
  }
}

export default AddDog
