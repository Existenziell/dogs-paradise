/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/router'
import { services } from '../../lib/services'
import useApp from '../../context/AppContext'
import Link from 'next/link'
import Head from 'next/head'
import Auth from '../../components/Auth'
import Header from '../../components/Header'
import Select from 'react-select'
import selectStyles from '../../lib/selectStyles'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { timeOptions } from '../../lib/config'
import Extras from '../../components/Extras'
import BackBtn from '../../components/BackBtn'

const CreateAppointment = ({ slug, service }) => {
  const { session, currentUser, userDogs, notify, darkmode } = useApp()
  const [formData, setFormData] = useState({})
  const [dogOptions, setDogOptions] = useState()
  const [dogSize, setDogSize] = useState(null)
  const [membership, setMembership] = useState(false)
  const [serviceOptions, setServiceOptions] = useState()
  const [appointmentDate, setAppointmentDate] = useState(new Date())
  const [selectedService, setSelectedService] = useState()
  const [priceTotal, setPriceTotal] = useState(0)
  const [styles, setStyles] = useState()
  const router = useRouter()

  // If slug is present, set selected service
  const incoming = { value: slug, label: service }
  useEffect(() => {
    if (incoming.value !== '') setFormData({ ...formData, ...{ type: service } })
  }, [])

  useEffect(() => {
    const selected = services.filter(s => s.slug === slug)[0]
    setSelectedService(selected)
  }, [slug, service, router.query])

  useEffect(() => {
    if (userDogs) {
      const options = []
      userDogs.forEach(dog => {
        options.push({ value: dog.id, label: dog.name })
      })
      setDogOptions(options)
    }
  }, [userDogs])

  useEffect(() => {
    if (services) {
      const options = []
      services.forEach(service => {
        options.push({ value: service.slug, label: service.title })
      })
      setServiceOptions(options)
    }
  }, [])

  function setService(e) {
    setFormData({ ...formData, ...{ type: e.value } })
    const selected = services.filter(s => s.slug === e.value)[0]
    setSelectedService(selected)
  }

  function setDog(e) {
    const selectedDog = userDogs.filter(d => (d.id === e.value))
    setDogSize(selectedDog.at(0).size)
    setMembership(selectedDog.at(0).is_member)
    setFormData({ ...formData, ...{ dog: e.value } })
  }

  function setTime(e) {
    setFormData({ ...formData, ...{ time: e.value } })
  }

  function setDelivery(e) {
    setFormData({ ...formData, ...{ deliveryOption: e.target.id === 'yes' } })
    calculatePrice()
  }

  function calculatePrice() {
    if (!selectedService) return 0
    // Set base price
    let price = dogSize ? selectedService.price[dogSize] : selectedService.price['small']
    // Bonus if dog is member
    if (membership) {
      price = parseInt(price) - parseInt(selectedService.price['bonus'])
    }
    // Check extras
    const extras = document.querySelectorAll('.calculate')
    Array.from(extras).forEach(el => {
      if (el.type === 'checkbox') {
        if (el.checked) {
          price = parseInt(price) + parseInt(el.value)
        }
      }
      if (el.type === 'radio') {
        if (el.checked) {
          price = parseInt(price) + parseInt(el.value)
        }
      }
    })
    setPriceTotal(price)
  }

  useEffect(() => {
    calculatePrice()
  }, [selectedService, dogSize, currentUser])

  const saveAppointment = async (e) => {
    e.preventDefault()

    // Check extras
    const bookedExtras = []
    const extras = document.querySelectorAll('.calculate')
    Array.from(extras).forEach(el => {
      const { id, name, checked, value } = el
      if (checked) {
        if (name === 'Pickup/Delivery') {
          if (parseInt(value) !== 0) { bookedExtras.push(name) }
        } else if (name === 'Room Size') {
          bookedExtras.push(`${name} ${id}`)
        } else {
          bookedExtras.push(el.name)
        }
      }
    })

    const { error } = await supabase
      .from('appointments')
      .insert([
        {
          user: currentUser.id,
          dog: formData.dog,
          type: formData.type,
          date: appointmentDate,
          time: formData.time,
          service_option: formData.deliveryOption,
          price: priceTotal,
          extras: bookedExtras.join(', '),
        },
      ])

    if (!error) {
      notify("Saved successfully!")
      router.push('/appointments')
    }
  }

  useEffect(() => {
    const tempStyles = selectStyles(darkmode)
    setStyles(tempStyles)
  }, [darkmode])

  if (!session) return <Auth />

  return (
    <>
      <Head>
        <title>Create Appointment</title>
        <meta name='description' content="Create Appointment" />
      </Head>
      <Header content='Create Appointment' />
      <BackBtn href='/profile' />

      <div className='px-4 md:px-8 py-24'>
        <form onSubmit={saveAppointment} className='flex flex-col items-start gap-4 max-w-4xl mx-auto bg-white text-brand-dark dark:bg-brand-dark dark:text-white p-2 md:p-6 rounded shadow'>

          <div className='flex items-center justify-start gap-4 w-full'>
            <p className='block w-1/2 md:w-1/6 text-left'>Service:</p>
            <div className='w-full md:w-[80%]'>
              <Select
                options={serviceOptions}
                onChange={setService}
                instanceId
                defaultValue={incoming?.value !== '' ? incoming : null}
                styles={styles}
              // isMulti
              />
            </div>
          </div>

          <div className='flex items-center justify-start gap-4 w-full'>
            <p className='block w-1/2 md:w-1/6 text-left'>Dog:</p>
            <div className='w-full md:w-[80%]'>
              {dogOptions?.length ?
                <Select
                  options={dogOptions}
                  onChange={setDog}
                  instanceId
                  styles={styles}
                // isMulti
                />
                :
                <div>Please <Link href='/dogs/add'><a className='link'>add a dog to the App</a></Link> first</div>
              }

            </div>
          </div>

          {selectedService &&
            <div className='flex flex-col md:flex-row justify-between w-full border dark:border-dark p-4 rounded-sm gap-8'>
              <Extras
                slug={selectedService.slug}
                priceTotal={priceTotal}
                setPriceTotal={setPriceTotal}
                calculatePrice={calculatePrice}
              />
              <img src={selectedService.img} alt='Service Image' className='max-w-xs shadow-sm rounded-sm' />
            </div>
          }

          {selectedService?.slug !== 'walker' &&
            <div className='text-left w-full'>
              <div className='flex items-center justify-start gap-4 mt-8'>
                <p>Would you like to use our Pickup/Delivery service? (+100 MXN)</p>
                <label htmlFor='no' className='cursor-pointer block'>
                  <input
                    type="radio" value={0}
                    name='Pickup/Delivery'
                    id='no'
                    onChange={setDelivery}
                    defaultChecked={true}
                    className='calculate'
                  /> No
                </label>
                <label htmlFor='yes' className='cursor-pointer'>
                  <input
                    type="radio" value={100}
                    name='Pickup/Delivery'
                    id='yes'
                    onChange={setDelivery}
                    defaultChecked={false}
                    className='calculate'
                  /> Yes
                </label>
              </div>
            </div>
          }

          <h2 className='mt-4 text-left'>Please select date and time for the appointment:</h2>
          <div className='w-full p-4 border dark:border-dark rounded-sm'>
            <div className='flex items-center justify-between gap-4 w-full overflow-hidden'>
              <p className='block md:w-1/6 text-left'>Date:</p>
              <div>
                <DatePicker selected={appointmentDate} onChange={(date) => setAppointmentDate(date)} className='px-4 py-2' />
              </div>
            </div>

            <div className='flex items-center justify-between gap-4 w-full mt-2'>
              <span className='block md:w-1/6 text-left'>Time:</span>
              <div className='md:ml-auto'>
                <Select
                  options={timeOptions}
                  onChange={setTime}
                  instanceId
                  styles={styles}
                />
              </div>
            </div>
          </div>

          <p>Membership Status: {membership ? `Member` : `No Member `}</p>
          <h2 className='mt-8 text-xl'>Price: {priceTotal} MXN</h2>

          <button
            type='submit'
            className='button'
            aria-label='Send Request'
            disabled={!formData.dog || !formData.type || !formData.time}
          >
            Send Request
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
