import convict from 'convict'
import convictFormatWithValidator from 'convict-format-with-validator'

convict.addFormats(convictFormatWithValidator)

const isProduction = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'
const isCdpEnvironment = Boolean(process.env.ENVIRONMENT) && process.env.ENVIRONMENT !== 'local'

const config = convict({
  serviceVersion: {
    doc: 'The service version, this variable is injected into your docker container in CDP environments',
    format: String,
    nullable: true,
    default: null,
    env: 'SERVICE_VERSION'
  },
  host: {
    doc: 'The IP address to bind',
    format: 'ipaddress',
    default: '0.0.0.0',
    env: 'HOST'
  },
  port: {
    doc: 'The port to bind',
    format: 'port',
    default: 3001,
    env: 'PORT'
  },
  serviceName: {
    doc: 'Api Service Name',
    format: String,
    default: 'fcp-fdm-dal-stub'
  },
  cdpEnvironment: {
    doc: 'The CDP environment the app is running in. With the addition of "local" for local development',
    format: [
      'local',
      'infra-dev',
      'management',
      'dev',
      'test',
      'perf-test',
      'ext-test',
      'prod'
    ],
    default: 'local',
    env: 'ENVIRONMENT'
  },
  log: {
    isEnabled: {
      doc: 'Is logging enabled',
      format: Boolean,
      default: !isTest,
      env: 'LOG_ENABLED'
    },
    level: {
      doc: 'Logging level',
      format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
      default: 'info',
      env: 'LOG_LEVEL'
    },
    format: {
      doc: 'Format to output logs in',
      format: ['ecs', 'pino-pretty'],
      default: isProduction ? 'ecs' : 'pino-pretty',
      env: 'LOG_FORMAT'
    },
    redact: {
      doc: 'Log paths to redact',
      format: Array,
      default: isProduction
        ? ['req.headers.authorization', 'req.headers.cookie', 'res.headers']
        : ['req', 'res', 'responseTime']
    }
  },
  // Outbound traffic must go through the proxy in CDP, so these are only optional locally.
  // Neither is read by the service: Node.js uses them directly.
  proxy: {
    httpsProxy: {
      doc: 'Outbound proxy URL, required in CDP environments (set via cdp-app-config)',
      format: String,
      nullable: !isCdpEnvironment,
      default: null,
      env: 'HTTPS_PROXY'
    },
    useEnvProxy: {
      doc: 'Enables Node.js native proxy support, without which HTTPS_PROXY is ignored. Node.js only accepts "1". Required in CDP environments (set via cdp-app-config)',
      format: ['1'],
      nullable: !isCdpEnvironment,
      default: null,
      env: 'NODE_USE_ENV_PROXY'
    },
    noProxy: {
      doc: 'Comma separated hosts that bypass the outbound proxy. Required in CDP environments (set via cdp-app-config)',
      format: String,
      nullable: !isCdpEnvironment,
      default: null,
      env: 'NO_PROXY'
    }
  },
  isSecureContextEnabled: {
    doc: 'Enable Secure Context',
    format: Boolean,
    default: isProduction,
    env: 'ENABLE_SECURE_CONTEXT'
  },
  isMetricsEnabled: {
    doc: 'Enable metrics reporting',
    format: Boolean,
    default: isProduction,
    env: 'ENABLE_METRICS'
  },
  tracing: {
    header: {
      doc: 'CDP tracing header name',
      format: String,
      default: 'x-cdp-request-id',
      env: 'TRACING_HEADER'
    }
  },
  fdm: {
    endpoint: {
      doc: 'FODS REST API endpoint',
      format: String,
      default: null,
      env: 'FDM_ENDPOINT'
    }
  },
  auth: {
    enabled: {
      doc: 'Whether Entra authentication is required for downstream Farming Operation Data Store API',
      format: Boolean,
      default: true,
      env: 'AUTH_ENABLED'
    },
    tenant: {
      doc: 'Azure tenant ID to authenticate clients',
      format: String,
      default: null,
      nullable: true,
      env: 'TENANT_ID'
    },
    clientId: {
      doc: 'Azure AD Client ID',
      format: String,
      default: null,
      nullable: true,
      env: 'CLIENT_ID'
    },
    clientSecret: {
      doc: 'Azure AD Client Secret',
      format: String,
      default: null,
      nullable: true,
      env: 'CLIENT_SECRET'
    }
  }
})

config.validate({ allowed: 'strict' })

export { config }
