import { Request, Response } from 'express'
import { when } from 'jest-when'
import CancelRateChangeHandler from './cancelRateChange'
import PrisonerPayService from '../../../services/prisonerPayService'
import OrchestratorService from '../../../services/orchestratorService'
import TestData from '../../../testutils/testData'
import { Action, Page, SubjectType } from '../../../services/auditService'
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
    jest.useFakeTimers({ now: new Date('2025-10-07T12:00:00Z') })
    jest.clearAllMocks()
    handler = new CancelRateChangeHandler(orchestratorService, prisonerPayService)
    req = {
      params: {
        rateId: rateChange.id,
      },
      body: { choice: 'yes' },
    } as unknown as Partial<Request>
    res = {
      locals: { user: TestData.PrisonUser(), payType: { type: 'LONG_TERM_SICK' } },
      render: jest.fn(),
      redirect: jest.fn(),
      redirectWithSuccess: jest.fn(),
    }

    when(orchestratorService.getPayRates).calledWith('MDI').mockResolvedValue([rateChange])

    jest.mocked(auditUtils.auditPageView).mockResolvedValue(undefined)
    jest.mocked(auditUtils.auditPageAction).mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe.each([
    ['a current rate', { ...rateChange, startDate: '2025-10-06' }],
    ['a rate starting today', { ...rateChange, startDate: '2025-10-07' }],
    ['a future rate for another pay type', { ...rateChange, type: 'RETIRED' }],
    ['an unknown ID', { ...rateChange, id: 'another-id' }],
  ])('rejecting %s', (_description, rate) => {
    beforeEach(() => {
      jest.mocked(orchestratorService.getPayRates).mockResolvedValueOnce([rate])
    })

    it.each(['GET', 'POST', 'invalid POST'])(
      'should return 404 for %s without rendering or cancelling',
      async method => {
        if (method === 'invalid POST') req.body = { choice: '' }
        const action = method === 'GET' ? handler.GET : handler.POST

        await expect(action(req as Request, res as Response)).rejects.toMatchObject({ status: 404 })

        expect(res.render).not.toHaveBeenCalled()
        expect(prisonerPayService.cancelRateChange).not.toHaveBeenCalled()
        expect(auditUtils.auditPageAction).not.toHaveBeenCalled()
        expect(res.redirectWithSuccess).not.toHaveBeenCalled()
      },
    )
  })

  describe('GET', () => {
    it('should render the correct view with rate change details', async () => {
      await handler.GET(req as Request, res as Response)

      expect(orchestratorService.getPayRates).toHaveBeenCalledWith('MDI')
      expect(res.render).toHaveBeenCalledWith('pages/changePayRate/cancel-rate-change', {
        payAmount: rateChange.rate,
        selectedDate: expect.any(Date),
      })
    })
  })

  describe('POST', () => {
    it('should redirect with success to pay-rates when choice is yes', async () => {
      await handler.POST(req as Request, res as Response)

      expect(prisonerPayService.cancelRateChange).toHaveBeenCalledWith(rateChange.id)
      expect(res.redirectWithSuccess).toHaveBeenCalledWith(
        '../../../pay-rates',
        'Pay rate updated',
        "You've cancelled the change to the pay rate for Long-term sick.",
      )
    })

    it('should audit the completed cancellation before redirecting', async () => {
      await handler.POST(req as Request, res as Response)

      expect(auditUtils.auditPageAction).toHaveBeenCalledTimes(1)
      expect(auditUtils.auditPageAction).toHaveBeenCalledWith(
        req,
        Page.CANCEL_RATE_CHANGE,
        Action.CANCEL_RATE_CHANGE,
        {
          payRateId: rateChange.id,
          prisonCode: 'MDI',
          payType: rateChange.type,
          payAmount: rateChange.rate,
          effectiveDate: rateChange.startDate,
        },
        SubjectType.NOT_APPLICABLE,
      )
      expect(jest.mocked(prisonerPayService.cancelRateChange).mock.invocationCallOrder[0]).toBeLessThan(
        jest.mocked(auditUtils.auditPageAction).mock.invocationCallOrder[0],
      )
      expect(jest.mocked(auditUtils.auditPageAction).mock.invocationCallOrder[0]).toBeLessThan(
        jest.mocked(res.redirectWithSuccess).mock.invocationCallOrder[0],
      )
    })

    it('should redirect to pay-rates when choice is no', async () => {
      req.body = { choice: 'no' }
      await handler.POST(req as Request, res as Response)

      expect(prisonerPayService.cancelRateChange).not.toHaveBeenCalled()
      expect(auditUtils.auditPageAction).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('../../../pay-rates')
    })

    it('should propagate cancellation errors without showing success', async () => {
      jest.mocked(prisonerPayService.cancelRateChange).mockRejectedValueOnce(new Error('Cancellation failed'))

      await expect(handler.POST(req as Request, res as Response)).rejects.toThrow('Cancellation failed')

      expect(res.redirectWithSuccess).not.toHaveBeenCalled()
      expect(auditUtils.auditPageAction).not.toHaveBeenCalled()
    })

    it('should render with errors when validation fails', async () => {
      req.body = { choice: '' }

      await handler.POST(req as Request, res as Response)

      expect(prisonerPayService.cancelRateChange).not.toHaveBeenCalled()
      expect(auditUtils.auditPageAction).not.toHaveBeenCalled()
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
