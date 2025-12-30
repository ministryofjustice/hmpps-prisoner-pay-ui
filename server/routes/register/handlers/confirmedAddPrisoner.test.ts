import { Request, Response } from 'express'
import ConfirmedAddPrisonerHandler from './confirmedAddPrisoner'

describe('ConfirmedAddPrisonerHandler', () => {
  let handler: ConfirmedAddPrisonerHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new ConfirmedAddPrisonerHandler()
    req = {}
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
    }
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/register/confirmed-add-prisoner', {})
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
