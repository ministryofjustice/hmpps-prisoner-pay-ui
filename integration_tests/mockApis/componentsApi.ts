import nunjucks from 'nunjucks'
import { stubFor } from './wiremock'

const templates = new nunjucks.Environment(
  new nunjucks.FileSystemLoader([
    'node_modules/@ministryofjustice/hmpps-connect-dps-components/dist/assets',
    'node_modules/govuk-frontend/dist',
  ]),
  { autoescape: true },
)

const abbreviatedName = (userName: string) => {
  const names = userName.trim().split(/\s+/)
  const lastName = names[names.length - 1]
  return `${names[0].charAt(0).toUpperCase()}. ${lastName.charAt(0).toUpperCase()}${lastName.slice(1).toLowerCase()}`
}

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

  stubFrontendComponents: (httpStatus = 200, userName = 'john smith') =>
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
        jsonBody:
          httpStatus === 200
            ? {
                header: {
                  html: templates.render('dpsComponents/header-bar.njk', {
                    isPrisonUser: true,
                    user: { displayName: userName },
                    name: abbreviatedName(userName),
                    dpsUrl: 'http://localhost:3007',
                  }),
                  css: [],
                  javascript: [],
                },
                footer: {
                  html: templates.render('dpsComponents/footer.njk', { isPrisonUser: true }),
                  css: [],
                  javascript: [],
                },
                meta: {},
              }
            : { status: 'DOWN' },
      },
    }),
}
