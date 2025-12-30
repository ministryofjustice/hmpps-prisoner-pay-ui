import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import PrisonerPayApiClient from './prisonerPayApiClient'

describe('PrisonerPayApiClient', () => {
  let prisonerPayApiClient: PrisonerPayApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    prisonerPayApiClient = new PrisonerPayApiClient(mockAuthenticationClient)
  })

  afterEach(() => {
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('patchPayStatusPeriod', () => {
    it('should return an empty object', () => {
      const response = prisonerPayApiClient.patchPayStatusPeriod('123', {})

      expect(response).toEqual({})
    })
  })

  describe('postPayStatusPeriod', () => {
    it('should return an empty object', () => {
      const response = prisonerPayApiClient.postPayStatusPeriod({})

      expect(response).toEqual({})
    })
  })
})
