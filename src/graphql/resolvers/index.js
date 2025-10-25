import { GraphQLScalarType, GraphQLError } from 'graphql'
import { messageResolvers } from './message.js'

const BigIntType = new GraphQLScalarType({
  name: 'BigInt',
  description: 'BigInt custom scalar type',
  serialize (value) {
    // Handle null/undefined values
    if (value === null || value === undefined) {
      return null
    }
    // Convert to string for JSON serialization
    return String(value)
  },
  parseValue (value) {
    // Handle null/undefined values
    if (value === null || value === undefined) {
      return null
    }
    // Parse from client input
    try {
      return BigInt(value)
    } catch (error) {
      throw new GraphQLError(`Invalid BigInt value: ${value}`)
    }
  },
  parseLiteral (ast) {
    // Handle null values
    if (ast.value === null) {
      return null
    }
    // Parse from query literal
    try {
      return BigInt(ast.value)
    } catch (error) {
      throw new GraphQLError(`Invalid BigInt literal: ${ast.value}`)
    }
  }
})

export const resolvers = {
  Query: {
    ...messageResolvers.Query
  },
  Message: {
    ...messageResolvers.Message
  },
  BigInt: BigIntType
}
