import { Agent as HttpAgent } from 'node:http'
import { Agent as HttpsAgent } from 'node:https'
import {
  defaultClient,
  DistributedTracingModes,
  getCorrelationContext,
  setup,
  start,
  type TelemetryClient,
} from 'applicationinsights'
import { RequestHandler } from 'express'
import type { ApplicationInfo } from '../applicationInfo'

const buildProxyEnv = () => ({
  HTTP_PROXY: process.env.HTTP_PROXY,
  HTTPS_PROXY: process.env.HTTPS_PROXY,
  NO_PROXY: process.env.NO_PROXY,
  http_proxy: process.env.http_proxy,
  https_proxy: process.env.https_proxy,
  no_proxy: process.env.no_proxy,
})

function configureProxyAgents(): void {
  const proxyEnv = buildProxyEnv()

  if (Object.values(proxyEnv).every(value => value === undefined)) {
    return
  }

  // Force the SDK onto Node's core proxy-aware agents instead of its own
  // legacy proxyUrl path, which rewrites HTTPS requests incorrectly for Envoy.
  defaultClient.config.proxyHttpUrl = ''
  defaultClient.config.proxyHttpsUrl = ''
  defaultClient.config.httpAgent = new HttpAgent({ keepAlive: true, proxyEnv })
  defaultClient.config.httpsAgent = new HttpsAgent({ keepAlive: true, proxyEnv })
}

export function initialiseAppInsights(): void {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    // eslint-disable-next-line no-console
    console.log('Enabling azure application insights')

    setup().setDistributedTracingMode(DistributedTracingModes.AI_AND_W3C)
    configureProxyAgents()
    start()
  }
}

export function buildAppInsightsClient(
  { applicationName, buildNumber }: ApplicationInfo,
  overrideName?: string,
): TelemetryClient {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    defaultClient.context.tags['ai.cloud.role'] = overrideName || applicationName
    defaultClient.context.tags['ai.application.ver'] = buildNumber

    defaultClient.addTelemetryProcessor(({ tags, data }, contextObjects) => {
      const operationNameOverride = contextObjects.correlationContext?.customProperties?.getProperty('operationName')
      if (operationNameOverride) {
        /*  eslint-disable no-param-reassign */
        tags['ai.operation.name'] = operationNameOverride
        data.baseData.name = operationNameOverride
        /*  eslint-enable no-param-reassign */
      }
      return true
    })

    return defaultClient
  }
  return null
}

export function appInsightsMiddleware(): RequestHandler {
  return (req, res, next) => {
    res.prependOnceListener('finish', () => {
      const context = getCorrelationContext()
      if (context && req.route) {
        const path = req.route?.path
        const pathToReport = Array.isArray(path) ? `"${path.join('" | "')}"` : path
        context.customProperties.setProperty('operationName', `${req.method} ${pathToReport}`)
      }
    })
    next()
  }
}
