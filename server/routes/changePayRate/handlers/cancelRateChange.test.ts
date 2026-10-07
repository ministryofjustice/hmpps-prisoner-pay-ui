import { Request, Response } from 'express'
import { when } from 'jest-when'
import CancelRateChangeHandler from './cancelRateChange'
import PrisonerPayService from '../../../services/prisonerPayService'
import OrchestratorService from '../../../services/orchestratorService'
import TestData from '../../../testutils/testData'
import * as auditUtils from '../../../utils/auditUtils'

jest.mock('../../../services/orchestratorService')
jest.mock('../../../services/prisonerPayService')
jest.mock('../../../utils/auditUtils')

const orchestratorService = new OrchestratorService(null)
const prisonerPayService = new PrisonerPayService(null)
const rateChange = TestData.PayRate()

describe('CancelRateChangeHandler', () => {
  let handler: CancelRateChangeHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    jest.clearAllMocks()
    handler = new CancelRateChangeHandler(orchestratorService, prisonerPayService)
    req = {
      params: {
        rateId: 'rate-123',
      },
      body: { choice: 'yes' },
    } as unknown as Partial<Request>
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      redirectWithSuccess: jest.fn(),
    }

    when(orchestratorService.getPayRateById).calledWith('rate-123').mockResolvedValue(TestData.PayRate())

    jest.mocked(auditUtils.auditPageView).mockResolvedValue(undefined)
  })

  describe('GET', () => {
    it('should render the correct view with rate change details', async () => {
      await handler.GET(req as Request, res as Response)

      expect(orchestratorService.getPayRateById).toHaveBeenCalledWith('rate-123')
      expect(res.render).toHaveBeenCalledWith('pages/changePayRate/cancel-rate-change', {
        payAmount: rateChange.rate,
        selectedDate: expect.any(Date),
      })
    })
  })

  describe('POST', () => {
    it('should redirect with success to pay-rates when choice is yes', async () => {
      await handler.POST(req as Request, res as Response)

      expect(prisonerPayService.cancelRateChange).toHaveBeenCalledWith('rate-123')
      expect(res.redirectWithSuccess).toHaveBeenCalledWith(
        '../../../pay-rates',
        'Pay rate updated',
        "You've cancelled the change to the pay rate for Long-term sick.",
      )
    })

    it('should redirect to pay-rates when choice is no', async () => {
      req.body = { choice: 'no' }
      await handler.POST(req as Request, res as Response)

      expect(prisonerPayService.cancelRateChange).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('../../../pay-rates')
    })

    it('should propagate cancellation errors without showing success', async () => {
      jest.mocked(prisonerPayService.cancelRateChange).mockRejectedValueOnce(new Error('Cancellation failed'))

      await expect(handler.POST(req as Request, res as Response)).rejects.toThrow('Cancellation failed')

      expect(res.redirectWithSuccess).not.toHaveBeenCalled()
    })

    it('should render with errors when validation fails', async () => {
      req.body = { choice: '' }

      await handler.POST(req as Request, res as Response)

      expect(prisonerPayService.cancelRateChange).not.toHaveBeenCalled()
      expect(res.render).toHaveBeenCalledWith(
        'pages/changePayRate/cancel-rate-change',
        expect.objectContaining({
          errors: expect.any(Array),
          choice: '',
          payAmount: 99,
          selectedDate: expect.any(Date),
        }),
      )
    })
  })
})
