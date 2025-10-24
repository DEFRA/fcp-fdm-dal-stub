import hapiApollo from '@as-integrations/hapi'
import { apolloServer } from '../graphql/server.js'
import { context } from '../graphql/context.js'

const apollo = {
  plugin: hapiApollo.default,
  options: {
    context,
    apolloServer,
    path: '/graphql'
  }
}

export { apollo }
