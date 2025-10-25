import { getMessages, getMessageByCorrelationId } from '../sources/messages.js'

export const messageResolvers = {
  Query: {
    messages: async (parent, { filters }) => {
      const response = await getMessages(filters)
      return response.data || response
    },

    message: async (parent, { correlationId, includeContent, includeEvents }) => {
      try {
        const response = await getMessageByCorrelationId(
          correlationId,
          includeContent,
          includeEvents
        )
        return response.data || response
      } catch (error) {
        if (error.output?.statusCode === 404) {
          try {
            const allMessagesResponse = await getMessages({
              includeContent,
              includeEvents
            })

            if (allMessagesResponse.data && allMessagesResponse.data.messages) {
              const message = allMessagesResponse.data.messages.find(m => m.correlationId === correlationId)
              return { message: message || null }
            }

            return { message: null }
          } catch (fallbackError) {
            return { message: null }
          }
        }
        throw error
      }
    }
  },

  Message: {
    status: (parent) => {
      const statusMap = {
        received: 'RECEIVED',
        'failure.validation': 'FAILURE_VALIDATION',
        sending: 'SENDING',
        delivered: 'DELIVERED',
        'failure.provider': 'FAILURE_PROVIDER',
        'failure.internal': 'FAILURE_INTERNAL',
        retry: 'RETRY',
        'retry.expired': 'RETRY_EXPIRED'
      }
      return statusMap[parent.status] || parent.status
    }
  }
}
