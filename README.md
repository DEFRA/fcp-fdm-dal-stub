![Build](https://github.com/defra/fcp-fdm-dal-stub/actions/workflows/publish.yml/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_fcp-fdm-dal-stub&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=DEFRA_fcp-fdm-dal-stub)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_fcp-fdm-dal-stub&metric=bugs)](https://sonarcloud.io/summary/new_code?id=DEFRA_fcp-fdm-dal-stub)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_fcp-fdm-dal-stub&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=DEFRA_fcp-fdm-dal-stub)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_fcp-fdm-dal-stub&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=DEFRA_fcp-fdm-dal-stub)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_fcp-fdm-dal-stub&metric=coverage)](https://sonarcloud.io/summary/new_code?id=DEFRA_fcp-fdm-dal-stub)

# Data Access Layer (DAL) stub for Farming Data Model (FDM)

The Farming Data Model (FDM) service is a common component to support data exchange between Farming and Countryside Programme (FCP) services.

FDM subscribes to events across the FCP ecosystem via an AWS SQS queue. These events are persisted and precompiled into a data model which can be queried via REST API endpoints.

The Data Access Layer (DAL) is intended to be the primary consumer of the FDM service.  This stub is therefore intended to support development of the FDM service in isolation by simulating the behaviour of the DAL.

## Requirements

### Docker

This application is intended to be run in a Docker container to ensure consistency across environments.

Docker can be installed from [Docker's official website](https://docs.docker.com/get-docker/).

> The test suite includes integration tests which are dependent on a Postgres container so cannot be run without Docker.

## Local development

### Setup

Install application dependencies:

```bash
npm install
```

### Development

To run the application in `development` mode run:

```bash
npm run docker:dev
```

### Testing

To test the application run:

```bash
npm run docker:test
```

Tests can also be run in watch mode to support Test Driven Development (TDD):

```bash
npm run docker:test:watch
```

## GraphQL API

The DAL stub exposes a GraphQL API following similar principles to the actual DAL using Apollo Server.

When running locally, Apollo explorer can be used to explore and test the GraphQL API once the application is running.  This can be accessed at `http://localhost:3001/graphql`

### Example queries

#### Messages

##### Example 1: Fetching a Message by Correlation ID

```graphql
query Message($correlationId: String!) {
  message(correlationId: $correlationId) {
    correlationId
    created
    crn
    events {
      id
      source
      type
      time
    }
    lastUpdated
    status
  }
}
```

##### Variables
```json
{
  "correlationId": "79389915-7275-457a-b8ca-8bf206b2e67b"
}
```

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { message(correlationId: \"79389915-7275-457a-b8ca-8bf206b2e67b\") { correlationId created crn events { id source type time } lastUpdated status } }"
  }' \
  http://localhost:3001/graphql
```

##### Example 2: Fetching All Messages with Filters

```graphql
query Messages($filters: MessageFilters) {
  messages(filters: $filters) {
    correlationId
    created
    crn
    status
  }
}
```

###### Variables

```json
{
  "filters": {
    "crn": 1234567890,
    "sbi": 987654321
  }
}
```

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query Messages($filters: MessageFilters!) { messages(filters: $filters) { correlationId created crn status } }",
    "variables": { "filters": { "crn": 1234567890, "sbi": 123456789 } }
  }' \
  http://localhost:3001/graphql
```

> **Note**: Only `crn` and `sbi` are allowed as filters when fetching multiple messages.

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable
information providers in the public sector to license the use and re-use of their information under a common open
licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
