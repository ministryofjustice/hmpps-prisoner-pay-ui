import { stubFor } from './wiremock'

export default {
  stubComponentsHealthPing: (httpStatus = 200) =>
    stubFor({
      request: {
        method: 'GET',
        urlPattern: '/components-api/health',
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
      },
    }),

  stubFrontendComponents: (httpStatus = 200) =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/components-api/components',
        queryParameters: {
          component: {
            hasExactly: [{ equalTo: 'header' }, { equalTo: 'footer' }],
          },
        },
      },
      response: {
        status: httpStatus,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
      },
    }),
}
