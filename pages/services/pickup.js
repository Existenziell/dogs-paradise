import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import useApp from '../../context/AppContext'
import { useRouter } from 'next/router'
import Head from 'next/head'
import LocationPicker from '../../components/services/LocationPicker'
import PickupUpload from '../../components/services/PickupUpload'
import Auth from '../../components/Auth'
import Header from '../../components/Header'
import { CheckCircleIcon } from '@heroicons/react/outline'

const Pickup = () => {
  const { session, currentUser, notify } = useApp()
  const [currentLocation, setCurrentLocation] = useState()
  const [phoneNumber, setPhoneNumber] = useState()
  const [coordinates, setCoordinates] = useState()
  const [picture, setPicture] = useState()
  const [pickupImageUrl, setPickupImageUrl] = useState(null)
  const router = useRouter()
  const appointmentId = router.query.appointment

  const saveLocation = (e) => {
    const coordinates = e.target.dataset.location
    setCoordinates(coordinates)
  }

  const savePhone = (e) => {
    const phone = e.target.previousSibling.value
    setPhoneNumber(phone)
  }

  const savePickup = async () => {
    const { error } = await supabase
      .from('pickups')
      .insert([
        { phone_number: phoneNumber, image_url: picture, coordinates, user_id: currentUser.id, appointment: appointmentId },
      ])

    if (!error) {
      notify("Successfully saved")
      router.push('/appointments')
    }
  }

  if (!session) return <Auth />

  return (
    <>
      <Head>
        <title>Pickup Service</title>
        <meta name='description' content="Pickup Service" />
      </Head>
      <Header content='Pickup Service' />

      <div className='flex flex-col items-center justify-center px-4 md:px-8 py-24  text-left'>
        <p className='mb-4 text-center text-sm'>We need additional information for pickup and delivery services. This data will of course be handled confidentially and only be used to make our service as smooth as possible for you. After completion, this data is deleted.</p>
        <p className='text-xl text-center mb-4'>Please follow these simple steps:</p>
        <div className={`bg-white dark:bg-brand-dark p-4 rounded w-full mb-8 relative transition-all ${picture && `border-4 border-brand`}`}>
          {picture && <CheckCircleIcon className='h-16 w-16 absolute top-1 right-1 text-brand hidden md:block' />}
          <div className='flex items-center justify-start gap-3'>
            <p className='border bg-brand-dark text-white text-base md:text-xl px-3 py-2 max-w-max rounded whitespace-nowrap'>Step 1</p>
            <p className='text-base md:text-xl inline-block'>Take a picture of your house / current location.</p>
          </div>
          <PickupUpload
            url={pickupImageUrl}
            size={150}
            onUpload={(url) => {
              setPickupImageUrl(url)
            }}
            setPicture={setPicture}
          />
        </div>

        <div className={`bg-white dark:bg-brand-dark p-4 rounded w-full mb-8 relative transition-all ${phoneNumber && `border-4 border-brand`}`}>
          <div className='flex items-center justify-start gap-3'>
            <p className='border bg-brand-dark text-white text-xl px-3 py-2 max-w-max rounded inline-block whitespace-nowrap'>Step 2</p>
            <p className='md:text-xl inline-block'>Enter your mobile number</p>
          </div>
          {phoneNumber && <CheckCircleIcon className='h-16 w-16 absolute top-1 right-1 text-brand hidden md:block' />}
          <div className='flex flex-col items-start'>
            {!phoneNumber &&
              <>
                <input type="text" placeholder='Phone Number' id='phone' name='phone' className='border px-4 py-3 text-brand-dark text-center rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand my-8' />
                <button onClick={savePhone} className='button' aria-label='Save Phone Number'>Save</button>
              </>
            }
          </div>
        </div>

        <div className={`bg-white dark:bg-brand-dark p-4 rounded w-full mb-8 relative transition-all ${coordinates && `border-4 border-brand`}`}>
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center justify-start gap-3 w-full'>
              <p className='border bg-brand-dark text-white text-xl px-3 py-2 max-w-max rounded inline-block whitespace-nowrap'>Step 3</p>
              {/* <div className='flex flex-col md:flex-row items-center justify-start gap-3'> */}
              <p className='md:text-xl inline-block'>Set your Pickup Location</p>
              <p className='text-xs hidden md:block'>(Hint: Use the round location picker and then click Save.)</p>
              {/* </div> */}
            </div>
            <button onClick={saveLocation} data-location={currentLocation} className='button md:self-end' aria-label='Save' disabled={!currentLocation}>Save</button>
          </div>
          {!coordinates &&
            <div className='flex flex-col items-start'>
              <LocationPicker currentLocation={currentLocation} setCurrentLocation={setCurrentLocation} />
              {currentLocation &&
                <div className='my-4'>
                  <p className='text-xl'>Current location:</p>
                  <p className='text-sm'>{currentLocation.join(', ')}</p>
                </div>
              }
            </div>
          }
        </div>

        <div className={`bg-white dark:bg-brand-dark p-4 rounded w-full mb-8 transition-all ${picture && phoneNumber && coordinates && `border-4 border-brand`}`}>
          <div className='flex items-center justify-start gap-3'>
            <p className='border bg-brand-dark text-white text-xl px-3 py-2 max-w-max rounded inline-block whitespace-nowrap'>Step 4</p>
            <p className='md:text-xl inline-block'>Send Request</p>
          </div>

          <div className='p-4'>
            <div className='my-4'>
              Picture:{` `}
              {picture ?
                <span className='text-brand'> {pickupImageUrl}</span>
                :
                <span className='text-brand'>Not set yet</span>
              }
            </div>
            <div className='mb-4'>
              Phone Number:{` `}
              {phoneNumber ?
                <span className='text-brand'>{phoneNumber}</span>
                :
                <span className='text-brand'>Not set yet</span>
              }
            </div>
            <div>
              Location:{` `}
              {coordinates ?
                <span className='text-brand'>{coordinates.split(',').join(', ')}</span>
                :
                <span className='text-brand'>Not set yet</span>
              }
            </div>
          </div>

          <button
            onClick={savePickup}
            className='mt-8 button'
            disabled={!picture || !phoneNumber || !coordinates}
            aria-label='Send Request'
          >
            Send
          </button>
          {(!picture || !phoneNumber || !coordinates) &&
            <p className='text-xs mt-2'>Please follow the above steps to enable the Pickup service</p>
          }
        </div>
      </div>
    </>
  )
}

export default Pickup
