import { stubFor } from './wiremock'

export default {
  stubPrisonHealthPing: (httpStatus = 200) =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/prison-api/health/ping',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
      },
    }),

  stubCaseloads: (httpStatus = 200) =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/prison-api/api/users/me/caseLoads.*',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: [
          {
            caseLoadId: 'MDI',
            currentlyActive: true,
            description: 'Moorland (HMP)',
            type: '',
            caseloadFunction: '',
          },
        ],
      },
    }),
}
