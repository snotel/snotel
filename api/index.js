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
    allSnotelReadings(name: String!, numReadings: Int): [SnotelReading]
  }
`

const resolvers = {
  Query: {
    allSnotelStations: (root, args, context) => {
      return nrcs.stations
    },
    allSnotelReadings: async (root, args, context) => {
      const station = nrcs.stations.find(station => station.name === args.name)

      if (!station) {
        return []
      }

      console.log(station)

      const readings = await nrcs.fetch({
        triplet: station.triplet,
        granularity: 'daily',
        readings: args.numReadings || '365'
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
