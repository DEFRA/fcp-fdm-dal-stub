import Wreck from '@hapi/wreck'
import { getToken } from '../auth/get-token.js'
import { config } from '../config.js'

export async function get (path) {
  const headers = config.get('auth.enabled')
    ? {
        Authorization: await getToken()
      }
    : {}

  const { payload } = await Wreck.get(`${config.get('fdm.endpoint')}${path}`, { headers, json: true })

  return payload
}
