import { getMessages, getMessageByCorrelationId } from '../sources/messages.js'

function findRequestedFields (selectionSet) {
  if (!selectionSet?.selections) {
    return new Set()
  }

  return selectionSet.selections.reduce((fields, sel) => {
    if (sel.kind === 'Field') {
      fields.add(sel.name.value)
      if (sel.selectionSet) {
        findRequestedFields(sel.selectionSet).forEach(fields.add, fields)
      }
    }
    return fields
  }, new Set())
}

export const messageResolvers = {
  Query: {
    messages: async (_parent, { filters }, _context, info) => {
      const fields = findRequestedFields(info.fieldNodes[0].selectionSet)
      const includeContent = fields.has('subject') || fields.has('body')
      const includeEvents = fields.has('events') && [...fields].some(f => f !== 'events')
      const response = await getMessages({ ...filters, includeContent, includeEvents })
      return response.data.messages
    },

    message: async (_parent, { correlationId }, _context, info) => {
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
