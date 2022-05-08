// https://github.com/naomigrace/nextjs-with-mapbox-gl-js/blob/master/pages/index.js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { initializeMap } from '../lib/map/initializeMap'
import { addDataLayer } from '../lib/map/addDataLayer'
import Head from 'next/head'
import langEN from '../i18n/en.json'
import langES from '../i18n/es.json'
import { COORDS } from '../lib/config'
import 'mapbox-gl/dist/mapbox-gl.css'

const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')

const MapComponent = ({ i18n }) => {
  const router = useRouter()
  const [Map, setMap] = useState()
  const [pageIsMounted, setPageIsMounted] = useState(false)

  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  const location = {
    type: "FeatureCollection",
    features: [
      {
        properties: {
          cluster: false,
        },
        geometry: {
          type: "Point",
          coordinates: COORDS
        }
      }
    ]
  }

  useEffect(() => {
    setPageIsMounted(true)

    // Use proper light/dark map theme
    let mapTheme = 'light'
    if (localStorage?.theme === 'dark') {
      mapTheme = 'dark'
    }

    const map = new mapboxgl.Map({
      container: 'map',
      // style: 'mapbox://styles/mapbox/dark-v10',
      // style: 'mapbox://styles/mapbox/light-v10',
      style: `mapbox://styles/mapbox/${mapTheme}-v10`,
      center: COORDS,
      zoom: 15.8,
    })

    initializeMap(map, i18n)
    setMap(map)

  }, [router.query.location])

  useEffect(() => {
    if (pageIsMounted) {
      Map.on('load', () => {
        addDataLayer(Map, location)
      })
    }
  }, [pageIsMounted, setMap, Map])

  return (
    <>
      <Head>
        <title>{i18n.title}</title>
        <meta name='description' content={i18n.desc} />
        <link href='https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css' rel='stylesheet' />
      </Head>

      <div id='map' className='w-full h-screen' />
    </>
  )
}

export async function getStaticProps(context) {
  let i18n
  context.locale === 'en' ?
    i18n = langEN.map :
    i18n = langES.map
  return {
    props: { i18n },
  }
}

export default MapComponent
