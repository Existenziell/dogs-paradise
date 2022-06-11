import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { COORDS } from '../../lib/config'
// import langEN from '../../i18n/en.json'
// import langES from '../../i18n/es.json'
import 'mapbox-gl/dist/mapbox-gl.css'

const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')

/* eslint-disable no-unused-vars */
const LocationPicker = ({ currentLocation, setCurrentLocation }) => {
  const [pageIsMounted, setPageIsMounted] = useState(false)
  const [Map, setMap] = useState()
  /* eslint-enable no-unused-vars */

  const router = useRouter()
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

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
      center: COORDS,
      zoom: 15.8,
    })

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    })

    map.addControl(
      geolocate
    )

    geolocate.on('geolocate', function (e) {
      var lon = e.coords.longitude
      var lat = e.coords.latitude
      var position = [lon, lat]
      setCurrentLocation(position)
    })

    setMap(map)
  }, [router.query.location, setCurrentLocation])

  return (
    <div id='map' className='w-full h-96 my-4' />
  )
}

export default LocationPicker
