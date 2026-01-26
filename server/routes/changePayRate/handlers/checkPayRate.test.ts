import { Request, Response } from 'express'
import { format, parse } from 'date-fns'
import CheckPayRateHandler from './checkPayRate'
import TestData from '../../../testutils/testData'

describe('CheckPayRateHandler', () => {
  let handler: CheckPayRateHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new CheckPayRateHandler()
    req = {
      session: {
        payAmount: '1.00',
        selectedDate: '15/08/2024',
      },
    } as Partial<Request>
    res = {
      locals: {
        payType: {
          dailyPayAmount: 0.65,
          description: 'Long-term sick',
        },
        user: TestData.PrisonUser(),
      },
      render: jest.fn(),
      redirectWithSuccess: jest.fn(),
    }
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
    it('should redirect with success message after processing', async () => {
      await handler.POST(req as Request, res as Response)

      const expectedDate = parse('15/08/2024', 'dd/MM/yyyy', new Date())
      const successMessage = `You've updated the pay for Long-term sick. The change will take effect from ${format(expectedDate, 'd MMMM yyyy')}.`

      expect(res.redirectWithSuccess).toHaveBeenCalledWith('../../pay-rates', 'Pay rate updated', successMessage)
    })
  })
})
