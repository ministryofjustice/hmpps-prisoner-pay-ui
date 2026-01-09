import type { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import TestData from '../../server/testutils/testData'

export default {
  stubPayOrchestratorHealthPing: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/pay-orchestrator-api/health/ping',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
      },
    }),

  stubGetPayStatusPeriods: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/pay-orchestrator-api/pay-status-periods.*',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: TestData.PayStatusPeriods(),
      },
    }),

  stubGetPayStatusPeriodById: (payStatusId: string, httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/pay-orchestrator-api/pay-status-periods/${payStatusId}`,
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: TestData.PayStatusPeriod(),
      },
    }),

  stubGetPrisonerByPrisonerNumber: (prisonerNumber: string, httpStatus = 200, prisoner = {}): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/pay-orchestrator-api/prisoners/${prisonerNumber}`,
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: prisoner,
      },
    }),

  stubSearchPrisoners: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/pay-orchestrator-api/prison/.*/candidate-search.*',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: TestData.Prisoners(),
      },
    }),
}
