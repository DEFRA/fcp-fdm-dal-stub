import { constants as httpConstants } from 'node:http2'
import { describe, test, beforeEach, afterEach, vi, expect } from 'vitest'
import Wreck from '@hapi/wreck'

const { HTTP_STATUS_OK } = httpConstants

const mockMessage = {
  correlationId: '79389915-7275-457a-b8ca-8bf206b2e67b'
}

vi.mock('@hapi/wreck')

const { createServer } = await import('../../../../src/server.js')

let server

describe('health routes', () => {
  beforeEach(async () => {
    vi.resetAllMocks()

    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('GET /graphql should return message by correlationId', async () => {
    const mockPayload = { data: { message: mockMessage } }
    Wreck.get.mockResolvedValue({ payload: mockPayload })

    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json',
        'x-apollo-operation-name': 'GetMessage'
      },
      payload: {
        query: `
          query Message($correlationId: String!) {
            message(correlationId: $correlationId) {
              correlationId
            }
          }
        `,
        variables: { correlationId: '79389915-7275-457a-b8ca-8bf206b2e67b' }
      }
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(HTTP_STATUS_OK)
    expect(JSON.parse(response.payload)).toEqual(mockPayload)
  })

  test('GET /graphql should return all messages', async () => {
    const mockPayload = { data: { messages: [mockMessage] } }
    Wreck.get.mockResolvedValue({ payload: mockPayload })

    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json',
        'x-apollo-operation-name': 'GetMessage'
      },
      payload: {
        query: `
          query Messages {
            messages {
              correlationId
            }
          }
        `
      }
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(HTTP_STATUS_OK)
    expect(JSON.parse(response.payload)).toEqual(mockPayload)
  })
})
