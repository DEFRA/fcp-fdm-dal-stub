import { getMessages, getMessageByCorrelationId } from '../sources/messages.js'

function findRequestedFields (selectionSet) {
  const fields = new Set()
  if (!selectionSet || !selectionSet.selections) return fields
  for (const sel of selectionSet.selections) {
    if (sel.kind === 'Field') {
      fields.add(sel.name.value)
      if (sel.selectionSet) {
        for (const subField of findRequestedFields(sel.selectionSet)) {
          fields.add(subField)
        }
      }
    }
  }
  return fields
}

export const messageResolvers = {
  Query: {
    messages: async (parent, { filters }, context, info) => {
      const fields = findRequestedFields(info.fieldNodes[0].selectionSet)
      const includeContent = fields.has('subject') || fields.has('body')
      const includeEvents = fields.has('events') && [...fields].some(f => f !== 'events')
      const response = await getMessages({ ...filters, includeContent, includeEvents })
      return response.data.messages
    },

    message: async (parent, { correlationId }, context, info) => {
      const fields = findRequestedFields(info.fieldNodes[0].selectionSet)
      const includeContent = fields.has('subject') || fields.has('body')
      const includeEvents = fields.has('events') && [...fields].some(f => f !== 'events')
      const response = await getMessageByCorrelationId(correlationId, { includeContent, includeEvents })
      return response.data.message
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
