import type { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'
import TestData from '../../server/testutils/testData'

export default {
  stubPrisonerPayHealthPing: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/prisoner-pay-api/health',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
      },
    }),

  stubPostPayStatusPeriod: (httpStatus = 201): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'POST',
        urlPattern: '/prisoner-pay-api/pay-status-periods',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: TestData.PayStatusPeriod(),
      },
    }),

  stubPatchPayStatusPeriod: (httpStatus = 200): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'PATCH',
        urlPattern: `/prisoner-pay-api/pay-status-periods/.*`,
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {},
      },
    }),
}
