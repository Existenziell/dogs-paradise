import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { COORDS } from '../../lib/config'
import 'mapbox-gl/dist/mapbox-gl.css'

const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')

const LocationPicker = ({ currentLocation, setCurrentLocation }) => {
  const router = useRouter()
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  useEffect(() => {
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
      const lon = e.coords.longitude
      const lat = e.coords.latitude
      const position = [lon, lat]
      setCurrentLocation(position)
    })
  }, [router.query.location, setCurrentLocation])

  return (
    <div id='map' className='w-full h-96 my-4' />
  )
}

export default LocationPicker
