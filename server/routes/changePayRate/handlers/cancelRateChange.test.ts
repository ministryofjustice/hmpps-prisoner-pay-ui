import { Request, Response } from 'express'
import CancelRateChangeHandler from './cancelRateChange'

describe('CancelRateChangeHandler', () => {
  let handler: CancelRateChangeHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new CancelRateChangeHandler()
    req = {
      session: {
        payAmount: '1000',
        selectedDate: '10/10/2023',
      },
      body: { choice: 'yes' },
    } as Partial<Request>
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
    }
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/changePayRate/cancel-rate-change', {
        payAmount: '1000',
        selectedDate: '10/10/2023',
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
