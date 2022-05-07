import { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import Head from 'next/head'
import Social from '../components/Social'
import PacmanLoader from 'react-spinners/PacmanLoader'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'
import Blob from '../components/Blob'
import Quote from '../components/Quote'

const Services = ({ i18n }) => {

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
      </Head>

      <div className='flex flex-col items-center justify-center px-4 md:px-8 py-24 lg:w-2/3 lg:mx-auto'>
        <h1 className='text-6xl mb-12'>{i18n.T1}</h1>

        <Blob classes='my-24' node={
          <Quote text='Let us find the right service for you' />
        } />
      </div>
    </>
  )
}

export async function getStaticProps(context) {
  let i18n
  context.locale === 'en' ?
    i18n = langEN.services :
    i18n = langES.services
  return {
    props: { i18n },
  }
}

export default Services
