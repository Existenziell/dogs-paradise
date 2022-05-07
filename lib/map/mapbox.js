import mapbox from 'mapbox-gl'

// https://docs.mapbox.com/help/glossary/access-token/
mapbox.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
const key = {}

export { mapbox, key }
