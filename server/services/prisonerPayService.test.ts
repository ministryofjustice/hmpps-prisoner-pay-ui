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
      const payStatusId = '123'
      const body = { status: 'removed' }

      prisonerPayService.patchPayStatusPeriod(payStatusId, body)

      expect(prisonerPayApiClientMock.patchPayStatusPeriod).toHaveBeenCalledWith(payStatusId, body)
      expect(prisonerPayApiClientMock.patchPayStatusPeriod).toHaveBeenCalledTimes(1)
    })
  })

  describe('postPayStatusPeriod', () => {
    it('should call postPayStatusPeriod on the api client with correct parameters', () => {
      const body = { prisonerId: '123', payType: 'long-term-sick' }

      prisonerPayService.postPayStatusPeriod(body)

      expect(prisonerPayApiClientMock.postPayStatusPeriod).toHaveBeenCalledWith(body)
      expect(prisonerPayApiClientMock.postPayStatusPeriod).toHaveBeenCalledTimes(1)
    })
  })
})
