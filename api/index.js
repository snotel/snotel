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
    readings(frequency: ReadingFrequency, count: Int): [SnotelReading]
  }

  type SnotelReading {
    date: String
    snowDepth: Int
    snowDepthChange: Int
    snowWaterEquivalent: Float
    snowWaterEquivalentChange: Float
  }

  enum ReadingFrequency {
    DAILY
    HOURLY
  }

  type Query {
    allSnotelStations(state: String): [SnotelStation]
    snotelStation(name: String!): SnotelStation
  }
`

const resolvers = {
  Query: {
    allSnotelStations: (root, args, context) => {
      if (args.state) {
        return nrcs.stations.filter(station => station.state === args.state)
      }

      return nrcs.stations
    },
    snotelStation: (root, args, context) => {
      const station = nrcs.stations.find(station => station.name === args.name)

      return station
    }
  },
  SnotelStation: {
    readings: async (root, args, context) => {
      const readings = await nrcs.fetch({
        triplet: root.triplet,
        granularity: args.frequency || 'daily',
        readings: args.count || '365'
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
