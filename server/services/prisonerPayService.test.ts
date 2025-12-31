import { CreatePayStatusPeriodRequest } from '../@types/prisonerPayAPI/types'
import PrisonerPayApiClient from '../data/prisonerPayApiClient'
import PrisonerPayService from './prisonerPayService'

jest.mock('../data/prisonerPayApiClient')

describe('PrisonerPayService', () => {
  const prisonerPayApiClientMock = new PrisonerPayApiClient(null) as jest.Mocked<PrisonerPayApiClient>
  let prisonerPayService: PrisonerPayService

  beforeEach(() => {
    jest.clearAllMocks()
    prisonerPayApiClientMock.patchPayStatusPeriod = jest.fn().mockReturnValue({})
    prisonerPayApiClientMock.postPayStatusPeriod = jest.fn().mockReturnValue({})
    prisonerPayService = new PrisonerPayService(prisonerPayApiClientMock)
  })

  describe('patchPayStatusPeriod', () => {
    it('should call patchPayStatusPeriod on the api client with correct parameters', () => {
      const request = {
        removeEndDate: true,
      }
      prisonerPayService.patchPayStatusPeriod('123', request)

      expect(prisonerPayApiClientMock.patchPayStatusPeriod).toHaveBeenCalledWith('123', request)
      expect(prisonerPayApiClientMock.patchPayStatusPeriod).toHaveBeenCalledTimes(1)
    })
  })

  describe('postPayStatusPeriod', () => {
    it('should call postPayStatusPeriod on the api client with correct parameters', () => {
      const body = {
        prisonCode: 'MDI',
        prisonerNumber: 'A1234BC',
        type: 'LONG_TERM_SICK',
        startDate: '2025-01-01',
      } as CreatePayStatusPeriodRequest

      prisonerPayService.postPayStatusPeriod(body)

      expect(prisonerPayApiClientMock.postPayStatusPeriod).toHaveBeenCalledWith(body)
      expect(prisonerPayApiClientMock.postPayStatusPeriod).toHaveBeenCalledTimes(1)
    })
  })
})
