import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import OrchestratorApiClient from './orchestratorApiClient'
import config from '../config'
import TestData from '../testutils/testData'

describe('OrchestratorApiClient', () => {
  let orchestratorApiClient: OrchestratorApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    orchestratorApiClient = new OrchestratorApiClient(mockAuthenticationClient)
  })

  afterEach(() => {
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('getPayStatusPeriods', () => {
    it('should make a GET request to the correct endpoint with query parameters', async () => {
      const latestStartDate = '2025-01-01'
      const prisonCode = 'MDI'
      const mockPayStatusPeriods = TestData.PayStatusPeriods()

      nock(config.apis.payOrchestratorApi.url)
        .get('/pay-status-periods')
        .query({ latestStartDate, prisonCode })
        .reply(200, mockPayStatusPeriods)

      const result = await orchestratorApiClient.getPayStatusPeriods(latestStartDate, prisonCode)

      expect(result).toEqual(mockPayStatusPeriods)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalled()
    })

    it('should handle empty response', async () => {
      const latestStartDate = '2025-01-01'
      const prisonCode = 'MDI'

      nock(config.apis.payOrchestratorApi.url)
        .get('/pay-status-periods')
        .query({ latestStartDate, prisonCode })
        .reply(200, [])

      const result = await orchestratorApiClient.getPayStatusPeriods(latestStartDate, prisonCode)

      expect(result).toEqual([])
    })

    it('should handle 404 Not Found', async () => {
      const latestStartDate = '2025-01-01'
      const prisonCode = 'INVALID'

      nock(config.apis.payOrchestratorApi.url)
        .get('/pay-status-periods')
        .query({ latestStartDate, prisonCode })
        .reply(404)

      await expect(orchestratorApiClient.getPayStatusPeriods(latestStartDate, prisonCode)).rejects.toThrow()
    })
  })

  describe('getPayStatusPeriodById', () => {
    it('should make a GET request to the correct endpoint', async () => {
      const payStatusId = '12345'
      const mockPayStatusPeriod = TestData.PayStatusPeriod()

      nock(config.apis.payOrchestratorApi.url).get(`/pay-status-periods/${payStatusId}`).reply(200, mockPayStatusPeriod)

      const result = await orchestratorApiClient.getPayStatusPeriodById(payStatusId)

      expect(result).toEqual(mockPayStatusPeriod)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalled()
    })

    it('should handle 404 Not Found', async () => {
      const payStatusId = 'invalid-id'

      nock(config.apis.payOrchestratorApi.url).get(`/pay-status-periods/${payStatusId}`).reply(404)

      await expect(orchestratorApiClient.getPayStatusPeriodById(payStatusId)).rejects.toThrow()
    })
  })

  describe('searchPrisoners', () => {
    it('should make a GET request to the candidate-search endpoint with the correct path and query', async () => {
      const query = 'Smith'
      const prisonCode = 'MDI'
      const mockPrisoners = TestData.Prisoners()

      nock(config.apis.payOrchestratorApi.url)
        .get(`/prison/${prisonCode}/candidate-search`)
        .query({ searchTerm: query })
        .reply(200, mockPrisoners)

      const result = await orchestratorApiClient.searchPrisoners(query, prisonCode)

      expect(result).toEqual(mockPrisoners)
      expect(mockAuthenticationClient.getToken).toHaveBeenCalled()
    })

    it('should handle empty search results', async () => {
      const query = 'Nonexistent'
      const prisonCode = 'MDI'

      nock(config.apis.payOrchestratorApi.url)
        .get(`/prison/${prisonCode}/candidate-search`)
        .query({ searchTerm: query })
        .reply(200, [])

      const result = await orchestratorApiClient.searchPrisoners(query, prisonCode)

      expect(result).toEqual([])
    })

    it('should handle special characters in search query', async () => {
      const query = "O'Brien"
      const prisonCode = 'MDI'
      const mockPrisoners = TestData.Prisoners()

      nock(config.apis.payOrchestratorApi.url)
        .get(`/prison/${prisonCode}/candidate-search`)
        .query({ searchTerm: query })
        .reply(200, mockPrisoners)

      const result = await orchestratorApiClient.searchPrisoners(query, prisonCode)

      expect(result).toEqual(mockPrisoners)
    })

    it('should handle 404 for invalid prison code', async () => {
      const query = 'Smith'
      const prisonCode = 'INVALID'

      nock(config.apis.payOrchestratorApi.url)
        .get(`/prison/${prisonCode}/candidate-search`)
        .query({ searchTerm: query })
        .reply(404)

      await expect(orchestratorApiClient.searchPrisoners(query, prisonCode)).rejects.toThrow()
    })
  })
})
