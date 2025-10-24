import { ApolloServer } from '@apollo/server'

const typeDefs = `
  type Query {
    hello: String
  }
`

const resolvers = {
  Query: {
    hello: () => 'Hello, world!'
  }
}

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers
})
