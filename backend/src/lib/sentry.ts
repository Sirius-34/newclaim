import { env } from './env'
import path from 'path'
import { rewriteFramesIntegration } from '@sentry/integrations'
import * as Sentry from '@sentry/node'
import { type LoggerMetaData } from './logger'

const isSentryEnabled = env.BACKEND_SENTRY_DSN

export const initSentry = () => {
  if (isSentryEnabled) {
    Sentry.init({
      dsn: env.BACKEND_SENTRY_DSN,
      environment: env.HOST_ENV,
      release: env.SOURCE_VERSION,
      normalizeDepth: 10,
      integrations: [
        rewriteFramesIntegration({
          root: path.resolve(__dirname, '../../..'),
        }),
      ],
    })
  }
}

export const sentryCaptureException = (error: Error, prettifiedMetaData?: LoggerMetaData) => {
  if (isSentryEnabled) {
    //    console.log('Sent to Sentry')
    Sentry.captureException(error, prettifiedMetaData)
  }
}
