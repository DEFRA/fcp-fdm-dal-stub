import { getMessages, getMessageByCorrelationId } from '../sources/messages.js'

function findRequestedFields (selectionSet) {
  if (!selectionSet?.selections) {
    return new Set()
  }

  return selectionSet.selections.reduce((fields, sel) => {
    if (sel.kind === 'Field') {
      fields.add(sel.name.value)
      if (sel.selectionSet) {
        for (const field of findRequestedFields(sel.selectionSet)) {
          fields.add(field)
        }
      }
    }
    return fields
  }, new Set())
}

export const messageResolvers = {
  Query: {
    messages: async (parent, { filters = {} }, context, info) => {
      const fields = findRequestedFields(info.fieldNodes[0].selectionSet)
      const includeContent = fields.has('subject') || fields.has('body')
      const includeEvents = fields.has('events') && [...fields].some(f => f !== 'events')
      const { crn, sbi, page = 1, pageSize = 20 } = filters
      const response = await getMessages({ crn, sbi, includeContent, includeEvents, page, pageSize })
      return {
        messages: response.data.messages,
        links: response.links,
        meta: response.meta
      }
    },

    message: async (_parent, { correlationId }, _context, info) => {
      const fields = findRequestedFields(info.fieldNodes[0].selectionSet)
      const includeContent = fields.has('subject') || fields.has('body')
      const includeEvents = fields.has('events') && [...fields].some(f => f !== 'events')
      const response = await getMessageByCorrelationId(correlationId, { includeContent, includeEvents })
      return response.data.message
    }
  }
}
