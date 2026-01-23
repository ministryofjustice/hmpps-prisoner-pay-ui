import { Request, Response } from 'express'
import CheckPayRateHandler from './checkPayRate'

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
      render: jest.fn(),
      redirect: jest.fn(),
    }
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/changePayRate/check-pay-rate', {
        payAmount: '1.00',
        selectedDate: expect.any(Date),
      })
    })
  })

  describe('POST', () => {
    it('should redirect after processing', async () => {
      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalled()
    })
  })

  // TODO: Add more test cases
})
