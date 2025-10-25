import { ApolloServer } from '@apollo/server'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { join } from 'path'

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
