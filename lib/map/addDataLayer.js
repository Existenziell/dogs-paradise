export function addDataLayer(map, data) {
  map.addSource('paradise', {
    type: 'geojson',
    data,
    cluster: false,
    clusterMaxZoom: 14,
    clusterRadius: 50,
    clusterProperties: {},
  })

  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'paradise',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-radius': 10,
      'circle-color': '#06768d',
      'circle-opacity': 0.75,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#000',
      'circle-stroke-opacity': 0.5,
    },
  })

  map.addLayer({
    id: 'event-count',
    type: 'symbol',
    source: 'paradise',
    filter: ['!', ['has', 'point_count']],
    layout: {
      'text-field': '{event_count}',
      'text-font': ['Open Sans Bold'],
      'text-size': 16,
    },
    paint: {
      'text-color': 'white',
    },
  })
}
