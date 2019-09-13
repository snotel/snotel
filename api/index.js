const { ApolloServer, gql } = require('apollo-server-micro')
const { nrcs } = require('snotel')

const typeDefs = gql`
  type SnotelStation {
    id: ID
    name: String
    triplet: String
    state: String
    country: String
    latitude: Float
    longitude: Float
    elevation: Int
  }

  type SnotelReading {
    date: String
    snowDepth: Int
    snowDepthChange: Int
    snowWaterEquivalent: Float
    snowWaterEquivalentChange: Float
  }

  type Query {
    allSnotelStations: [SnotelStation]
    allSnotelReadings: [SnotelReading]
  }
`

const resolvers = {
  Query: {
    allSnotelStations: (root, args, context) => {
      return nrcs.stations
    },
    allSnotelReadings: async (root, args, context) => {
      const readings = await nrcs.fetch({
        triplet: '992:UT:SNTL',
        granularity: 'daily',
        readings: '365'
      })

      return readings
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true
})

module.exports = server.createHandler({ path: '/api' })
