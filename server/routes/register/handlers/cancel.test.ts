import { Request, Response } from 'express'
import CancelHandler from './cancel'

describe('CancelHandler', () => {
  let handler: CancelHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new CancelHandler()
    req = {
      params: { payTypeSlug: 'long-term-sick' },
      query: {
        query: 'test',
      },
      body: {},
      session: {
        selectedPrisoner: {
          firstName: 'Joe',
          lastName: 'Bloggs',
        },
      },
    } as unknown as Partial<Request>

    res = {
      render: jest.fn(),
      redirect: jest.fn(),
    }
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/register/cancel', {
        prisonerName: 'Joe Bloggs',
      })
    })
  })

  describe('POST', () => {
    it('should redirect to pay overview page when selecting that you want to cancel the application', async () => {
      req.body.choice = 'yes'

      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalledWith('/long-term-sick/pay-overview')
    })

    it('should redirect to check page after selecting that you do not want to cancel the application', async () => {
      req.body.choice = 'no'
      req.session.returnTo = 'check'

      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalledWith('check')
    })

    it('should redirect to dashboard page after selecting No and returnTo is null ', async () => {
      req.body.choice = 'no'
      req.session.returnTo = undefined

      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalledWith('/')
    })
  })
})
