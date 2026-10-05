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
        registerJourney: {
          prisoner: {
            firstName: 'Joe',
            lastName: 'Bloggs',
          },
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
      req.session.registerJourney.returnTo = 'check'

      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalledWith('check')
    })

    it('should redirect to dashboard page after selecting No and returnTo is null ', async () => {
      req.body.choice = 'no'
      req.session.registerJourney.returnTo = undefined

      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalledWith('add-prisoner')
    })
  })
  it('clears only the registration draft when cancelled', async () => {
    req.session.returnTo = '/authentication-return'
    req.session.selectedDate = 'other journey date'
    req.body.choice = 'yes'
    await handler.POST(req as Request, res as Response)
    expect(req.session.registerJourney).toBeUndefined()
    expect(req.session.returnTo).toBe('/authentication-return')
    expect(req.session.selectedDate).toBe('other journey date')
  })

  it('uses the journey return page rather than the authentication return URL', async () => {
    req.session.returnTo = '/authentication-return'
    req.session.registerJourney.returnTo = 'start-date'
    req.body.choice = 'no'
    await handler.POST(req as Request, res as Response)
    expect(res.redirect).toHaveBeenCalledWith('start-date')
    expect(req.session.returnTo).toBe('/authentication-return')
  })

  it('returns to search when the draft has expired', async () => {
    delete req.session.registerJourney
    await handler.GET(req as Request, res as Response)
    await handler.POST(req as Request, res as Response)
    expect(res.redirect).toHaveBeenCalledWith('add-prisoner')
  })
})
