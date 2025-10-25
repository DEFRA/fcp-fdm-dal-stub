import { join } from 'node:path'
import { ApolloServer } from '@apollo/server'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'

import { resolvers } from './resolvers/index.js'

const typesArray = loadFilesSync(join(import.meta.dirname, 'types'), { extensions: ['gql'] })
const typeDefs = mergeTypeDefs(typesArray)

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export const apolloServer = new ApolloServer({
  schema,
  introspection: true,
  csrfPrevention: true
})

export async function start () {
  if (apolloServer.internals.state.phase !== 'started') {
    console.log('Starting Apollo Server...')
    await apolloServer.start()
  }
}

export async function stop () {
  if (apolloServer.internals.state.phase === 'started') {
    console.log('Stopping Apollo Server...')
    await apolloServer.stop()
  }
}
