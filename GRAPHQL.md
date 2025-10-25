# GraphQL API Documentation

This GraphQL API provides a modern interface over the FDM REST API for accessing farming data and messages.

## Endpoints

- **GraphQL Endpoint**: `http://localhost:3001/graphql`
- **GraphQL Playground**: `http://localhost:3001/graphql` (with introspection enabled in development)

## Available Operations

### Queries

#### 1. Get All Messages
```graphql
query GetMessages($filters: MessageFilters) {
  messages(filters: $filters) {
    messages {
      correlationId
      crn
      sbi
      recipient
      subject
      body
      status
      created
      lastUpdated
      events {
        type
      }
    }
  }
}
```

**Variables:**
```json
{
  "filters": {
    "crn": 1234567890,
    "sbi": 987654321,
    "includeContent": true,
    "includeEvents": true
  }
}
```

#### 2. Get Message by Correlation ID
```graphql
query GetMessage($correlationId: String!, $includeContent: Boolean, $includeEvents: Boolean) {
  message(correlationId: $correlationId, includeContent: $includeContent, includeEvents: $includeEvents) {
    message {
      correlationId
      crn
      sbi
      recipient
      subject
      body
      status
      created
      lastUpdated
      events {
        type
      }
    }
  }
}
```

**Variables:**
```json
{
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "includeContent": true,
  "includeEvents": true
}
```

#### 3. Health Check
```graphql
query HealthCheck {
  health
}
```

## Data Types

### Message
- `correlationId`: String! - Unique identifier for the message
- `crn`: Int! - Customer Reference Number
- `sbi`: Int! - Single Business Identifier
- `recipient`: String - Email address (included when includeContent=true)
- `subject`: String - Message subject (included when includeContent=true)
- `body`: String - Message content (included when includeContent=true)
- `status`: MessageStatus! - Current message status
- `created`: String! - ISO datetime when message was created
- `lastUpdated`: String! - ISO datetime when message was last updated
- `events`: [Event!] - Event history (included when includeEvents=true)

### MessageStatus Enum
- `RECEIVED`
- `FAILURE_VALIDATION`
- `SENDING`
- `DELIVERED`
- `FAILURE_PROVIDER`
- `FAILURE_INTERNAL`
- `RETRY`
- `RETRY_EXPIRED`

### Event
- `type`: String! - CloudEvent type indicating the event category

### MessageFilters Input
- `crn`: Int - Filter by Customer Reference Number
- `sbi`: Int - Filter by Single Business Identifier  
- `includeContent`: Boolean - Include recipient, subject, and body
- `includeEvents`: Boolean - Include event history

## Example Usage

### Basic Query for All Messages
```graphql
{
  messages {
    messages {
      correlationId
      crn
      sbi
      status
      created
    }
  }
}
```

### Query with Filters and Content
```graphql
{
  messages(filters: { crn: 1234567890, includeContent: true }) {
    messages {
      correlationId
      recipient
      subject
      status
    }
  }
}
```

### Get Specific Message with Events
```graphql
{
  message(correlationId: "550e8400-e29b-41d4-a716-446655440000", includeEvents: true) {
    message {
      correlationId
      status
      events {
        type
      }
    }
  }
}
```

## Architecture

The GraphQL layer acts as a gateway to the downstream FDM REST API:

1. **GraphQL Server**: Apollo Server with schema-first approach
2. **Schema**: Type definitions loaded from `.gql` files
3. **Resolvers**: Business logic that calls the REST API
4. **Data Sources**: Abstraction layer for REST API calls
5. **Context**: Per-request context with data source instances

## Authentication

The GraphQL API inherits authentication from the underlying REST API. JWT Bearer tokens are automatically forwarded to the downstream service.

## Development

The GraphQL Playground is available in development mode for interactive exploration of the API. Use introspection to explore the full schema and available operations.
