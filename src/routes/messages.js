import { get } from '../fdm/get.js'

const messages = {
  method: 'GET',
  path: '/messages',
  options: {
    description: 'Messages endpoint',
    notes: 'Returns a list of messages',
    tags: ['api', 'messages']
  },
  handler: async (_request, h) => {
    const fdmResponse = await get('/messages')
    return h.response(fdmResponse)
  }
}

export { messages }
