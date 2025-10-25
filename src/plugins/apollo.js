import hapiApollo from '@as-integrations/hapi'
import { apolloServer } from '../graphql/server.js'

const apollo = {
  plugin: hapiApollo.default,
  options: {
    apolloServer,
    path: '/graphql'
  }
}

export { apollo }
