import { Request, Response } from 'express'
import PayAmountHandler from './payAmount'

describe('PayAmountHandler', () => {
  let handler: PayAmountHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new PayAmountHandler()
    req = {}
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
    }
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/changePayRate/pay-amount', {})
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
