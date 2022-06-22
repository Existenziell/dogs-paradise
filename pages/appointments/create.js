import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import useApp from '../../context/AppContext'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Auth from '../../components/Auth'
import Header from '../../components/Header'
import Select from 'react-select'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { services } from '../../lib/services'

const CreateAppointment = ({ slug, service }) => {
  const { session, currentUser, userDogs, notify } = useApp()
  const [formData, setFormData] = useState({})
  const [dogOptions, setDogOptions] = useState()
  const [serviceOptions, setServiceOptions] = useState()
  const [appointmentDate, setAppointmentDate] = useState(new Date())
  const [selectedService, setSelectedService] = useState()
  const router = useRouter()

  useEffect(() => {
    let serviceObj = services.filter(s => s.slug === slug)[0]
    setSelectedService(serviceObj)
  }, [slug, service, router.query])

  const incoming = { value: slug, label: service }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (incoming.value !== '') setFormData({ ...formData, ...{ type: service } })
  }, [])
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (userDogs) {
      let options = []
      userDogs.forEach(dog => {
        options.push({ value: dog.id, label: dog.name })
      })
      setDogOptions(options)
    }
  }, [userDogs])

  useEffect(() => {
    if (services) {
      let options = []
      services.forEach(service => {
        options.push({ value: service.slug, label: service.title })
      })
      setServiceOptions(options)
    }
  }, [])

  function setType(e) {
    setFormData({ ...formData, ...{ type: e.value } })
    let selected = services.filter(s => s.slug === e.value)[0]
    setSelectedService(selected)
  }

  function setDog(e) {
    setFormData({ ...formData, ...{ dog: e.value } })
  }

  function setTime(e) {
    if (e.target) {
      const { name, value } = e.target
      setFormData({ ...formData, ...{ [name]: value } })
    } else {
      // am|pm
      setFormData({ ...formData, ...{ ampm: e.value } })
    }
  }

  function setService(e) {
    setFormData({ ...formData, ...{ serviceOption: e.target.value } })
  }

  const saveAppointment = async (e) => {
    e.preventDefault()
    const time = `${formData.timeHour} : ${formData.timeMinute}`
    const { error } = await supabase
      .from('appointments')
      .insert([
        {
          user: currentUser.id,
          dog: formData.dog,
          type: formData.type,
          date: appointmentDate,
          time: time,
          service_option: formData.serviceOption
        },
      ])

    if (!error) {
      notify("Saved successfully!")
      router.push('/appointments')
    }
  }

  if (!session) return <Auth />

  return (
    <>
      <Head>
        <title>Create Appointment</title>
        <meta name='description' content="Create Appointment" />
      </Head>
      <Header content='Create Appointment' />

      <div className='px-8 py-24'>
        <form onSubmit={saveAppointment} className='flex flex-col gap-4 max-w-lg mx-auto bg-white text-brand-dark p-6 rounded shadow'>

          <div className='flex items-center justify-start gap-4 w-full'>
            <p className='block w-1/6 text-left'>Service:</p>
            <div className='w-full md:w-[80%]'>
              <Select
                options={serviceOptions}
                onChange={setType}
                instanceId
                defaultValue={incoming?.value !== '' ? incoming : null}
              // isMulti
              // isDisabled={!showEdit}
              />
            </div>

          </div>

          {selectedService &&
            <>
              <div className='text-left'>
                {selectedService.desc}
              </div>

              <div className='text-left text-xs shadow p-4'>
                <p className='mb-2 text-sm'>Prices for this Service:</p>
                <div className='shadow-sm p-2 bg-gray-50'>{selectedService.prices}</div>
                <p className='mt-2'>All prices are in Pesos</p>
              </div>
            </>
          }

          <div className='flex items-center justify-start gap-4 w-full'>
            <p className='block w-1/6 text-left'>Dog:</p>
            <div className='w-full md:w-[80%]'>
              <Select
                options={dogOptions}
                onChange={setDog}
                instanceId
              // isMulti
              />
            </div>
          </div>

          <div className='flex items-center justify-around gap-4 w-full'>
            <p className='block w-1/6 text-left'>Date:</p>
            <div className='mr-auto'>
              <DatePicker selected={appointmentDate} onChange={(date) => setAppointmentDate(date)} className='px-4 py-2' />
            </div>
          </div>

          <div className='flex items-center justify-start gap-4 w-full'>
            <span className='block w-1/6 text-left'>Time:</span>
            <div className='flex items-center text-center'>
              <input
                type='number' name='timeHour' id='timeHour'
                required min={0} max={12}
                onChange={setTime}
                className='text-center w-16 px-3 py-2 border rounded'
              />
              <span className='mx-2'>:</span>
              <input
                required min={0} max={59}
                type='number' name='timeMinute' id='timeMinute'
                onChange={setTime}
                className='text-center w-16 px-3 py-2 border rounded mr-4'
              />
              <Select
                options={[{ value: 'am', label: 'am' }, { value: 'pm', label: 'pm' }]}
                onChange={setTime}
                instanceId
              />
            </div>
          </div>

          <div className='text-left w-full'>
            <p className='mb-1'>Would you like to use our Pickup/Delivery service?</p>
            <div className='flex items-center justify-start gap-4'>
              <label htmlFor='no' className='cursor-pointer block'>
                <input
                  type="radio" value="false"
                  name='no'
                  id='no'
                  onChange={setService}
                  checked={formData.serviceOption === 'false'}
                /> No
              </label>
              <label htmlFor='yes' className='cursor-pointer'>
                <input
                  type="radio" value="true"
                  name='yes'
                  id='yes'
                  onChange={setService}
                  checked={formData.serviceOption === 'true'}
                /> Yes
              </label>
            </div>
          </div>

          <button
            type='submit'
            className='mt-8 button'
            aria-label='Send Request'
            disabled={!formData.dog || !formData.type || !formData.timeHour || !formData.timeMinute || !formData.ampm || !formData.serviceOption}
          >
            Save
          </button>
        </form>
      </div>
    </>
  )
}

export async function getServerSideProps({ query }) {
  let slug = ''
  let service = ''

  if (query?.slug) {
    slug = query.slug
    service = query.service
  }

  return {
    props: { slug, service },
  }
}

export default CreateAppointment
