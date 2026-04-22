import config from './config'

describe('config agent proxy support', () => {
  it('passes proxy env through to outbound API agents', () => {
    const expectedProxyEnv = {
      HTTP_PROXY: process.env.HTTP_PROXY,
      HTTPS_PROXY: process.env.HTTPS_PROXY,
      NO_PROXY: process.env.NO_PROXY,
      http_proxy: process.env.http_proxy,
      https_proxy: process.env.https_proxy,
      no_proxy: process.env.no_proxy,
    }

    const apiAgents = [
      config.apis.hmppsAuth.agent,
      config.apis.tokenVerification.agent,
      config.apis.payOrchestratorApi.agent,
      config.apis.prisonerPayApi.agent,
      config.apis.componentApi.agent,
      config.apis.prisonApi.agent,
    ]

    apiAgents.forEach(agent => {
      expect((agent as typeof agent & { proxyEnv?: NodeJS.ProcessEnv }).proxyEnv).toEqual(expectedProxyEnv)
    })
  })
})
