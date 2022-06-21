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

const CreateAppointment = () => {
  const { session, currentUser, userDogs, notify } = useApp()
  const [formData, setFormData] = useState({})
  const [dogOptions, setDogOptions] = useState()
  const [typeOptions, setTypeOptions] = useState()
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const router = useRouter()

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
        options.push({ value: service.title, label: service.title })
      })
      setTypeOptions(options)
    }
  }, [])

  function setType(e) {
    setFormData({ ...formData, ...{ type: e.value } })
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
        <form onSubmit={saveAppointment} className='flex flex-col gap-4 max-w-lg mx-auto bg-gray-100 p-4 rounded'>

          <div className='flex items-center justify-start gap-4 w-full'>
            <p className='block w-1/6 text-left'>Type:</p>
            <div className='w-full md:w-[80%]'>
              <Select
                options={typeOptions}
                onChange={setType}
                instanceId
              // defaultValue={"hello"}
              // isMulti
              // isDisabled={!showEdit}
              />
            </div>
          </div>

          <div className='flex items-center justify-start gap-4 w-full'>
            <p className='block w-1/6 text-left'>Dog(s):</p>
            <div className='w-full md:w-[80%]'>
              <Select
                options={dogOptions}
                onChange={setDog}
                instanceId
              // defaultValue={"hello"}
              // isMulti
              // isDisabled={!showEdit}
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
                className='text-center w-16 px-3 py-2'
              />
              <span className='mx-2'>:</span>
              <input
                required min={0} max={59}
                type='number' name='timeMinute' id='timeMinute'
                onChange={setTime}
                className='text-center w-16 px-3 py-2 mr-4'
              />
              <Select
                options={[{ value: 'am', label: 'am' }, { value: 'pm', label: 'pm' }]}
                onChange={setTime}
                instanceId
              // defaultValue={'am'}
              // isDisabled={}
              />
            </div>
          </div>

          <div className='flex items-center text-left justify-start gap-4 w-full'>
            <span className=''>Would you like to use our Pickup/Delivery service?</span>
            <div className=''>
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

export default CreateAppointment
