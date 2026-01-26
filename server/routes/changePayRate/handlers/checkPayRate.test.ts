import { Request, Response } from 'express'
import { format, parse } from 'date-fns'
import { when } from 'jest-when'
import CheckPayRateHandler from './checkPayRate'
import TestData from '../../../testutils/testData'
import PrisonerPayService from '../../../services/prisonerPayService'

jest.mock('../../../services/prisonerPayService')

const prisonerPayService = new PrisonerPayService(null)

describe('CheckPayRateHandler', () => {
  let handler: CheckPayRateHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new CheckPayRateHandler(prisonerPayService)
    req = {
      session: {
        payAmount: '1.00',
        selectedDate: '15/08/2024',
      },
    } as Partial<Request>
    res = {
      locals: {
        payType: {
          type: 'LONG_TERM_SICK',
          dailyPayAmount: 0.65,
          description: 'Long-term sick',
        },
        user: TestData.PrisonUser(),
      },
      render: jest.fn(),
      redirectWithSuccess: jest.fn(),
    }

    when(prisonerPayService.patchPayRate).calledWith(expect.any(Object)).mockResolvedValue(undefined)
  })

  describe('GET', () => {
    it('should render the correct view with parsed date', async () => {
      await handler.GET(req as Request, res as Response)

      const expectedDate = parse('15/08/2024', 'dd/MM/yyyy', new Date())

      expect(res.render).toHaveBeenCalledWith('pages/changePayRate/check-pay-rate', {
        payAmount: '1.00',
        selectedDate: expectedDate,
      })
    })
  })

  describe('POST', () => {
    it('should call patchPayRate with correct parameters', async () => {
      await handler.POST(req as Request, res as Response)

      expect(prisonerPayService.patchPayRate).toHaveBeenCalledWith({
        payType: 'LONG_TERM_SICK',
        payAmount: '1.00',
        effectiveDate: '2024-08-15',
      })
    })

    it('should redirect with success message after processing', async () => {
      await handler.POST(req as Request, res as Response)

      const expectedDate = parse('15/08/2024', 'dd/MM/yyyy', new Date())
      const successMessage = `You've updated the pay for Long-term sick. The change will take effect from ${format(expectedDate, 'd MMMM yyyy')}.`

      expect(res.redirectWithSuccess).toHaveBeenCalledWith('../../pay-rates', 'Pay rate updated', successMessage)
    })
  })
})
