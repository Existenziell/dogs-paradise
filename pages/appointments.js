import { useEffect, useState } from 'react'
import { GridLoader } from 'react-spinners'
import Auth from '../components/Auth'
import Head from 'next/head'
import Header from '../components/Header'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'
import getAppointments from '../lib/getAppointments'
import downloadImage from '../lib/supabase/downloadImage'
import useApp from '../context/AppContext'

const Appointments = ({ i18n }) => {
  const [appointments, setAppointments] = useState(null)
  const { session } = useApp()
  const bucket = 'pickups'

  useEffect(() => {
    if (session) getPickups()
  }, [session])

  const getPickups = async () => {
    const appointments = await getAppointments()
    for (const a of appointments) {
      const image = await downloadImage(bucket, a.image_url, () => { })
      const blob = new Blob([image], { type: image.type })
      const img = URL.createObjectURL(blob)
      a.image = img
    }
    setAppointments(appointments)
  }

  if (!session) return <Auth />

  if (!appointments) {
    return (
      <div className='flex items-center justify-center w-full h-screen'>
        <GridLoader color={'var(--color-brand)'} size={30} />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>
      <Header content={i18n.T1} />

      <div className='flex flex-col items-center justify-center px-4 md:px-8 py-24'>
        {appointments.length ?
          appointments.map(a => {
            return (
              <div className='flex gap-8 bg-white text-brand-dark dark:bg-brand-dark dark:text-white rounded px-4 py-3 my-3 text-left' key={a.id}>
                <img
                  src={a.image}
                  alt="Pickup Image"
                  className="rounded shadow-lg w-1/3"
                />
                <div className='text-xl'>
                  <p><span className='text-xs block'>Created at: </span>{a.updated_at?.slice(0, 10)}</p>
                  <p><span className='text-xs block mt-2'>Coordinates: </span>{a.coordinates}</p>
                  <p><span className='text-xs block mt-2'>Phone Number: </span>{a.phone_number}</p>
                </div>
              </div>
            )
          })
          :
          <p>No appointments yet.</p>
        }
      </div>
    </>
  )
}

export async function getStaticProps(context) {
  let i18n
  context.locale === 'en' ?
    i18n = langEN.appointments :
    i18n = langES.appointments
  return {
    props: { i18n },
  }
}

export default Appointments
