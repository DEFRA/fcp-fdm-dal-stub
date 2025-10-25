import { get } from '../../fdm/get.js'

export async function getMessages (filters = {}) {
  const queryParams = new URLSearchParams()

  if (filters.crn) {
    queryParams.append('crn', filters.crn.toString())
  }

  if (filters.sbi) {
    queryParams.append('sbi', filters.sbi.toString())
  }

  if (filters.includeContent) {
    queryParams.append('includeContent', 'true')
  }

  if (filters.includeEvents) {
    queryParams.append('includeEvents', 'true')
  }

  const queryString = queryParams.toString()
  const basePath = '/messages'
  const path = queryString ? `${basePath}?${queryString}` : basePath

  return get(path)
}

export async function getMessageByCorrelationId (correlationId, filters = {}) {
  if (!correlationId) {
    throw new Error('correlationId is required')
  }

  const queryParams = new URLSearchParams()

  if (filters.includeContent) {
    queryParams.append('includeContent', 'true')
  }

  if (filters.includeEvents) {
    queryParams.append('includeEvents', 'true')
  }

  const queryString = queryParams.toString()
  const basePath = `/messages/${correlationId}`
  const path = queryString ? `${basePath}?${queryString}` : basePath

  return get(path)
}
