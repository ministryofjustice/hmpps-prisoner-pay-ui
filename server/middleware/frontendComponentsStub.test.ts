import { Request, Response } from 'express'
import nock from 'nock'
import { getFrontendComponents } from '@ministryofjustice/hmpps-connect-dps-components'
import componentsApi from '../../integration_tests/mockApis/componentsApi'
import { stubFor } from '../../integration_tests/mockApis/wiremock'
import config from '../config'
import logger from '../../logger'

jest.mock('../../integration_tests/mockApis/wiremock')

describe('frontend components API stub contract', () => {
  afterEach(() => {
    nock.cleanAll()
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it.each([
    ['A TestUser', 'A. Testuser'],
    ['Some OtherTestUser', 'S. Othertestuser'],
  ])('returns components the client can consume for %s without falling back', async (name, expectedName) => {
    componentsApi.stubFrontendComponents(200, name)
    const mapping = jest.mocked(stubFor).mock.calls[0][0] as {
      response: { status: number; jsonBody: Record<string, unknown> }
    }
    const api = nock('http://components.test')
      .get('/components')
      .query(true)
      .reply(mapping.response.status, mapping.response.jsonBody)
    const errorLog = jest.spyOn(logger, 'error')
    const res = {
      locals: { user: { token: 'test-token' } },
      get: jest.fn(),
      set: jest.fn(),
    } as unknown as Response
    const next = jest.fn()

    await getFrontendComponents({
      componentApiConfig: { ...config.apis.componentApi, url: 'http://components.test' },
      requestOptions: { includeSharedData: true },
      dpsUrl: 'http://localhost:3007',
      logger,
    })({} as Request, res, next)

    expect(api.isDone()).toBe(true)
    expect(errorLog).not.toHaveBeenCalled()
    expect(res.locals.feComponents.header).toContain(expectedName)
    expect(res.locals.feComponents.header).toContain('href="/sign-out"')
    expect(res.locals.feComponents.footer).toContain('<footer')
    expect(res.locals.feComponents.cssIncludes).toEqual([])
    expect(res.locals.feComponents.jsIncludes).toEqual([])
    expect(res.locals.feComponents.sharedData).toEqual({})
    expect(next).toHaveBeenCalledTimes(1)
  })
})
