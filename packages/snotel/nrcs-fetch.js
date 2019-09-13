const { promisify } = require('util')
const fetch = require('isomorphic-fetch')
const parseCsvCallback = require('csv-parse')

const parseCsv = promisify(parseCsvCallback)

const buildUrl = ({ triplet, readings, granularity }) => {
  return [
    'http://www.wcc.nrcs.usda.gov/reportGenerator/view_csv/customSingleStationReport/',
    granularity,
    '/',
    triplet,
    '%7Cid%3D%22%22%7Cname/-',
    readings.toLowerCase(),
    '%2C0/WTEQ%3A%3Avalue%2CWTEQ%3A%3Adelta%2CSNWD%3A%3Avalue%2CSNWD%3A%3Adelta'
  ].join('')
}

module.exports = async ({ triplet, readings, granularity }) => {
  const url = buildUrl({ triplet, readings, granularity })
  const result = await fetch(url)
  const text = await result.text()

  const csvData = await parseCsv(text, {
    comment: '#',
    skip_lines_with_error: true
  })

  csvData.shift()
  return csvData.map(reading => {
    const [date, swe, sweChange, snowDepth, snowDepthChange] = reading

    return {
      date,
      snowDepth: parseInt(snowDepth) || 0,
      snowDepthChange: parseInt(snowDepthChange) || 0,
      snowWaterEquivalent: parseFloat(swe) || 0.0,
      snowWaterEquivalentChange: parseFloat(sweChange) || 0.0
    }
  })
  .reverse()
}
