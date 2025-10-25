import { GraphQLScalarType, GraphQLError } from 'graphql'
import { messageResolvers } from './message.js'

const BigIntType = new GraphQLScalarType({
  name: 'BigInt',
  description: 'BigInt custom scalar type',
  serialize (value) {
    if (value == null) {
      return null
    }

    return String(value)
  },
  parseValue (value) {
    if (value == null) {
      return null
    }

    try {
      return BigInt(value)
    } catch {
      throw new GraphQLError(`Invalid BigInt value: ${value}`)
    }
  },
  parseLiteral (ast) {
    if (ast.value == null) {
      return null
    }

    try {
      return BigInt(ast.value)
    } catch {
      throw new GraphQLError(`Invalid BigInt literal: ${ast.value}`)
    }
  }
})

export const resolvers = {
  Query: {
    ...messageResolvers.Query
  },
  BigInt: BigIntType
}
