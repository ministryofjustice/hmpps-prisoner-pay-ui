import { Request, Response } from 'express'
import AddPrisonerHandler from './addPrisoner'

describe('AddPrisonerHandler', () => {
  let handler: AddPrisonerHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new AddPrisonerHandler()
    req = {}
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
    }
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/register/add-prisoner', {})
    })
  })

  describe('POST', () => {
    it('should redirect after processing', async () => {
      req.body = { query: 'some query' }
      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalled()
    })
  })
})
