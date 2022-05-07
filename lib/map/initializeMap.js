import { mapbox } from './mapbox.js'

export function initializeMap(map, i18n) {

  const html = `
    <div>
        <span>Anno 2014</span>
        <h1>Dog's Paradise</h1>
        <h2>${i18n.T1}</h2>
        <p>Calle 1 Sur, entre Avenida 20 y 25</p><p>77600 San Miguel de Cozumel</p>
        <strong>+52 987 134 9372</strong>
    </div>
  `
  const coordinates = [-86.946551, 20.507471]

  // Always open markerpopup on load
  new mapbox.Popup()
    .setLngLat(coordinates)
    .setHTML(html)
    .addTo(map)

  // Open marker popup on click
  map.on('click', 'unclustered-point', (e) => {
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
