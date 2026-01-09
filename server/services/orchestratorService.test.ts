import OrchestratorApiClient from '../data/orchestratorApiClient'
import OrchestratorService from './orchestratorService'
import TestData from '../testutils/testData'

jest.mock('../data/orchestratorApiClient')

describe('OrchestratorService', () => {
  const orchestratorApiClient = new OrchestratorApiClient(null) as jest.Mocked<OrchestratorApiClient>
  let orchestratorService: OrchestratorService

  beforeEach(() => {
    jest.clearAllMocks()
    orchestratorService = new OrchestratorService(orchestratorApiClient)
  })

  describe('getPayStatusPeriodsByType', () => {
    it('should call the API client with the correct parameters', async () => {
      const latestStartDate = '2025-01-01'
      const prisonCode = 'MDI'
      const mockPayStatusPeriods = TestData.PayStatusPeriods()

      orchestratorApiClient.getPayStatusPeriods.mockResolvedValue(mockPayStatusPeriods)

      const result = await orchestratorService.getPayStatusPeriodsByType(latestStartDate, prisonCode)

      expect(orchestratorApiClient.getPayStatusPeriods).toHaveBeenCalledWith(latestStartDate, prisonCode)
      expect(result).toEqual(mockPayStatusPeriods)
    })

    it('should return an empty array when no pay status periods are found', async () => {
      const latestStartDate = '2025-01-01'
      const prisonCode = 'MDI'

      orchestratorApiClient.getPayStatusPeriods.mockResolvedValue([])

      const result = await orchestratorService.getPayStatusPeriodsByType(latestStartDate, prisonCode)

      expect(result).toEqual([])
    })

    it('should propagate errors from the API client', async () => {
      const latestStartDate = '2025-01-01'
      const prisonCode = 'MDI'
      const error = new Error('API error')

      orchestratorApiClient.getPayStatusPeriods.mockRejectedValue(error)

      await expect(orchestratorService.getPayStatusPeriodsByType(latestStartDate, prisonCode)).rejects.toThrow(
        'API error',
      )
    })
  })

  describe('getPayStatusPeriodById', () => {
    it('should call the API client with the correct pay status ID', () => {
      const payStatusId = '12345'
      const mockPayStatusPeriod = TestData.PayStatusPeriods()[0]

      orchestratorApiClient.getPayStatusPeriodById.mockReturnValue(mockPayStatusPeriod)

      const result = orchestratorService.getPayStatusPeriodById(payStatusId)

      expect(orchestratorApiClient.getPayStatusPeriodById).toHaveBeenCalledWith(payStatusId)
      expect(result).toEqual(mockPayStatusPeriod)
    })
  })

  describe('getPrisonerByPrisonerNumber', () => {
    it('should call the API client with the correct prisoner number', () => {
      const prisonerNumber = 'G4529UP'
      const mockPrisoner = TestData.Prisoner()

      orchestratorApiClient.getPrisonerByPrisonerNumber.mockReturnValue(mockPrisoner)

      const result = orchestratorService.getPrisonerByPrisonerNumber(prisonerNumber)

      expect(orchestratorApiClient.getPrisonerByPrisonerNumber).toHaveBeenCalledWith(prisonerNumber)
      expect(result).toEqual(mockPrisoner)
    })
  })

  describe('searchPrisoners', () => {
    it('should call the API client with the correct search query and prison code', async () => {
      const query = 'Smith'
      const prisonCode = 'MDI'
      const mockPrisoners = TestData.Prisoners()

      orchestratorApiClient.searchPrisoners.mockResolvedValue(mockPrisoners)

      const result = await orchestratorService.searchPrisoners(query, prisonCode)

      expect(orchestratorApiClient.searchPrisoners).toHaveBeenCalledWith(query, prisonCode)
      expect(result).toEqual(mockPrisoners)
    })

    it('should return an empty array when no prisoners match the search', async () => {
      const query = 'Nonexistent'
      const prisonCode = 'MDI'

      orchestratorApiClient.searchPrisoners.mockResolvedValue([])

      const result = await orchestratorService.searchPrisoners(query, prisonCode)

      expect(result).toEqual([])
    })

    it('should propagate errors from the API client', async () => {
      const query = 'Smith'
      const prisonCode = 'MDI'
      const error = new Error('Search failed')

      orchestratorApiClient.searchPrisoners.mockRejectedValue(error)

      await expect(orchestratorService.searchPrisoners(query, prisonCode)).rejects.toThrow('Search failed')
    })
  })
})
