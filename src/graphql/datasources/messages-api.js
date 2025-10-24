import { get } from '../../fdm/get.js'

export class MessagesAPI {
  async getMessages (filters = {}) {
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
    const path = `/messages${queryString ? `?${queryString}` : ''}`

    return await get(path)
  }

  async getMessageByCorrelationId (correlationId, includeContent = false, includeEvents = false) {
    const queryParams = new URLSearchParams()

    if (includeContent) {
      queryParams.append('includeContent', 'true')
    }

    if (includeEvents) {
      queryParams.append('includeEvents', 'true')
    }

    const queryString = queryParams.toString()
    const path = `/messages/${correlationId}${queryString ? `?${queryString}` : ''}`

    return await get(path)
  }

  async getHealth () {
    return await get('/health')
  }
}
