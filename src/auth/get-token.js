import Wreck from '@hapi/wreck'
import { config } from '../config.js'

const auth = config.get('auth')
const { tenant, clientId, clientSecret } = auth

export async function getToken () {
  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
    scope: `${clientId}/.default`
  })

  try {
    const { payload } = await Wreck.post(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      payload: form.toString(),
      json: true
    })

    return `${payload.token_type} ${payload.access_token}`
  } catch (error) {
    console.error('Error fetching token:', error)
    throw error
  }
}
