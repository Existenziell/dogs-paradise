import { useState } from 'react'
import Router from 'next/router'
import Head from 'next/head'
import Social from '../components/Social'
import PacmanLoader from 'react-spinners/PacmanLoader'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'

const Contact = ({ i18n }) => {

  const [formData, setFormData] = useState()
  const [sending, setSending] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  function setData(e) {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  const submitForm = async e => {
    e.preventDefault()
    setSending(true)
    let data = { ...formData }

    try {
      const res = await fetch('/api/sendMail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      res.ok ?
        Router.push('/success')
        :
        setErrorMsg(`Sorry, an error occured: ${res.statusText}`)
    } catch (error) {
      setErrorMsg('Sorry, an error occured. Have you tried turning it off and on again?')
    }
  }

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>

      <div className='flex flex-col items-center justify-center px-4 md:px-8 py-24 lg:w-2/3 lg:mx-auto'>
        <h1 className='text-4xl md:text-6xl mb-12 mt-4'>{i18n.T1}</h1>
        <div className='md:flex items-center gap-8 md:text-right'>
          <div className='md:w-2/3'>
            <p className='text-lg mx-auto leading-relaxed mb-8 max-w-sm'>{i18n.T2}</p>
          </div>
          <img src='/img/sergio.jpg' alt={i18n.T1} className='md:w-1/2 shadow rounded' />
        </div>

        <Social />

        <div className='z-0 px-4 pt-8 pb-0 sm:px-12 shadow w-full bg-cover bg-no-repeat bg-poly rounded-lg bg-white/10 backdrop-blur-md text-white'>
          <form onSubmit={submitForm}>
            <div className='relative mb-8 text-white'>
              <input
                id='name' name='name' type='text'
                onChange={setData} required disabled={sending}
                className='peer h-10 w-full placeholder-transparent focus:outline-none bg-white/10 backdrop-blur-md rounded pl-4 border-none' placeholder={i18n.T4}
              />
              <label htmlFor='name'
                className='absolute -top-5 left-0 text-sm transition-all
                            peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-placeholder-shown:left-4
                            peer-focus:-top-5 peer-focus:left-0 peer-focus:text-gray-300 peer-focus:text-sm'>{i18n.T4}</label>
            </div>
            <div className='relative mb-8'>
              <input
                id='email' type='email' name='email'
                onChange={setData} required disabled={sending}
                className='peer h-10 w-full placeholder-transparent focus:outline-none bg-white/10 backdrop-blur-md rounded pl-4 border-none' placeholder={i18n.T5}
              />
              <label htmlFor='email'
                className='absolute -top-5 left-0 text-sm transition-all
                            peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-placeholder-shown:left-4
                            peer-focus:-top-5 peer-focus:left-0 peer-focus:text-gray-300 peer-focus:text-sm'>{i18n.T5}</label>
            </div>
            <div className='relative'>
              <textarea
                id='message' name='message'
                onChange={setData} rows='10' required disabled={sending}
                className='peer h-full w-full placeholder-transparent focus:outline-none bg-white/10 backdrop-blur-md rounded pl-4 border-none py-4' placeholder={i18n.T6}>
              </textarea>
              <label htmlFor='message'
                className='absolute -top-5 left-0 text-sm transition-all
                            peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-placeholder-shown:left-4
                            peer-focus:-top-5 peer-focus:left-0 peer-focus:text-gray-300 peer-focus:text-sm'>{i18n.T6}</label>
            </div>

            {errorMsg ?
              <div className='text-left bg-brand text-white p-4'>
                {errorMsg}
              </div>
              :
              sending ?
                <div className='my-8 h-16 mr-16 opacity-60'>
                  <PacmanLoader color={'white'} size={30} />
                </div>
                :
                <input type='submit' className='button my-4' aria-label='Send Contact Form' value={i18n.T7}></input>
            }
          </form>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps(context) {
  let i18n
  context.locale === 'en' ?
    i18n = langEN.contact :
    i18n = langES.contact
  return {
    props: { i18n },
  }
}

export default Contact
