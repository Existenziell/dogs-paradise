import { mapbox } from './mapbox.js'

export function initializeMap(map, coordinates, phone_number, pickupImageUrl) {
  const html = `
    <div>
        <img src=${pickupImageUrl} />
        <p>Phone Number</p>
        <span>${phone_number}</span>
    </div>
  `

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
