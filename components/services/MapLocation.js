import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { initializeMap } from '../../lib/map/initializeMap'
import { addDataLayer } from '../../lib/map/addDataLayer'
import 'mapbox-gl/dist/mapbox-gl.css'
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')

const MapLocation = ({ coordinates, phone_number, pickupImageUrl, extras }) => {
  const [pageIsMounted, setPageIsMounted] = useState(false)
  const [Map, setMap] = useState()

  const coords = coordinates.split(',')
  const router = useRouter()
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
          coordinates: coords
        }
      }
    ]
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setPageIsMounted(true)

    // Use proper light/dark map theme
    let mapTheme = 'light'
    if (localStorage?.theme === 'dark') {
      mapTheme = 'dark'
    }

    const map = new mapboxgl.Map({
      container: 'map',
      style: `mapbox://styles/mapbox/${mapTheme}-v10`,
      center: coords,
      zoom: 15.8,
    })

    initializeMap(map, coords, phone_number, pickupImageUrl, extras)
    setMap(map)

  }, [router.query.location, pickupImageUrl])

  useEffect(() => {
    if (pageIsMounted) {
      Map.on('load', () => {
        addDataLayer(Map, location)
      })
    }
  }, [pageIsMounted, setMap, Map])
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div id='map' className='w-full h-full' />
  )
}

export default MapLocation
