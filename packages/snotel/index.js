const nrcsStations = require('./nrcs-stations.json')
const nrcsFetch = require('./nrcs-fetch')

module.exports.nrcs = {
  fetch: nrcsFetch,
  stations: nrcsStations.map(station => {
    return {
      id: station.triplet,
      name: station.name.toLowerCase().replace(/\s+/g, '_'),
      triplet: station.triplet,
      state: station.triplet.split(':')[1].toLowerCase(),
      country: 'us',
      latitude: station.latitude,
      longitude: station.longitude,
      elevation: station.elevation
    }
  })
}
