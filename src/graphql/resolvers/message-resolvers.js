export const messageResolvers = {
  Query: {
    messages: async (parent, { filters }, { dataSources }) => {
      const response = await dataSources.messagesAPI.getMessages(filters)
      return response.data || response
    },

    message: async (parent, { correlationId, includeContent, includeEvents }, { dataSources }) => {
      try {
        // Try to get the specific message first
        const response = await dataSources.messagesAPI.getMessageByCorrelationId(
          correlationId,
          includeContent,
          includeEvents
        )
        return response.data || response
      } catch (error) {
        if (error.output?.statusCode === 404) {
          // If specific endpoint doesn't exist, fall back to getting all messages and filtering
          try {
            const allMessagesResponse = await dataSources.messagesAPI.getMessages({
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
    },

    health: async (parent, args, { dataSources }) => {
      const response = await dataSources.messagesAPI.getHealth()
      return response.message || 'healthy'
    }
  },

  Message: {
    // Transform status enum values to match GraphQL enum
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
