import { ApolloServer } from '@apollo/server'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

import { resolvers } from './resolvers/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load all GraphQL schema files
const typesArray = loadFilesSync(join(__dirname, 'types'), { extensions: ['gql'] })
const typeDefs = mergeTypeDefs(typesArray)

// Create executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export const apolloServer = new ApolloServer({
  schema,
  introspection: true, // Enable GraphQL Playground in development
  csrfPrevention: true
})
