import { mapbox } from './mapbox.js'
import { COORDS } from '../config.js'

export function initializeMap(map, i18n) {

  const html = `
    <div>
        <span>${i18n.T1}</span>
        <h1>${i18n.T2}</h1>
        <h2>${i18n.T3}</h2>
        <p>${i18n.T4}</p>
        <p>${i18n.T5}</p>
        <strong>${i18n.T6}</strong>
    </div>
  `
  const coordinates = COORDS

  // Always open markerpopup on load
  new mapbox.Popup()
    .setLngLat(coordinates)
    .setHTML(html)
    .addTo(map)

  // Open marker popup on click
  map.on('click', 'unclustered-point', () => {
    new mapbox.Popup().setLngLat(coordinates).setHTML(html).addTo(map)
  })

  // Add geolocate control to the map.
  new mapbox.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  })

}
