import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import PrisonerPayApiClient from './prisonerPayApiClient'
import config from '../config'
import TestData from '../testutils/testData'
import { CreatePayStatusPeriodRequest } from '../@types/prisonerPayAPI/types'

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
      const response = prisonerPayApiClient.patchPayStatusPeriod('123', {
        removeEndDate: false,
      })

      expect(response).toEqual({})
    })
  })

  describe('postPayStatusPeriod', () => {
    it('should make a POST request with the correct payload and return a pay status period', async () => {
      const createRequest = {
        prisonCode: 'PVI',
        prisonerNumber: 'A1234AA',
        type: 'LONG_TERM_SICK',
        startDate: '2025-08-12',
      } as CreatePayStatusPeriodRequest
      const mockPayStatusPeriod = TestData.PayStatusPeriod()

      nock(config.apis.prisonerPayApi.url).post('/pay-status-periods', createRequest).reply(201, mockPayStatusPeriod)

      const response = await prisonerPayApiClient.postPayStatusPeriod(createRequest)

      expect(response).toEqual(mockPayStatusPeriod)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalled()
    })

    it('should handle validation errors', async () => {
      const createRequest = {
        prisonCode: '',
        prisonerNumber: '',
        type: 'LONG_TERM_SICK',
        startDate: '',
      } as CreatePayStatusPeriodRequest

      nock(config.apis.prisonerPayApi.url)
        .post('/pay-status-periods', createRequest)
        .reply(422, { message: 'Validation error' })

      await expect(prisonerPayApiClient.postPayStatusPeriod(createRequest)).rejects.toThrow()
    })
  })
})
