const fetch = require('snotel/nrcs-fetch')

fetch({
  triplet: '992:UT:SNTL',
  granularity: 'daily',
  readings: '365'
}).then(console.log)
