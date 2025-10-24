import { messageResolvers } from './message-resolvers.js'

export const resolvers = {
  Query: {
    ...messageResolvers.Query
  },
  Message: {
    ...messageResolvers.Message
  }
}
