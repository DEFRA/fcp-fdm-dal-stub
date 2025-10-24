import { MessagesAPI } from './datasources/messages-api.js'

export async function context ({ request }) {
  return {
    dataSources: {
      messagesAPI: new MessagesAPI()
    }
  }
}
