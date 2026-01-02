import { Request, Response } from 'express'
import { when } from 'jest-when'
import AddPrisonerHandler from './addPrisoner'
import validateForm from './addPrisonerValidation'

jest.mock('./addPrisonerValidation')

describe('AddPrisonerHandler', () => {
  let handler: AddPrisonerHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    jest.clearAllMocks()
    handler = new AddPrisonerHandler()
    req = {
      params: { payTypeSlug: 'long-term-sick' },
      body: {},
    }
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
    it('should redirect when validation passes', async () => {
      req.body = { query: 'G4529UP' }
      when(validateForm).calledWith({ query: 'G4529UP' }).mockReturnValue(null)

      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalledWith('./add-prisoner-results?query=G4529UP')
    })

    it('should call validateForm with the query', async () => {
      req.body = { query: 'G4529UP' }
      when(validateForm).calledWith({ query: 'G4529UP' }).mockReturnValue(null)

      await handler.POST(req as Request, res as Response)

      expect(validateForm).toHaveBeenCalledWith({ query: 'G4529UP' })
    })

    it('should render the form with errors when validation fails', async () => {
      req.body = { query: '' }
      const error = { text: 'Required', href: '#query' }
      when(validateForm).calledWith({ query: '' }).mockReturnValue(error)

      await handler.POST(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/register/add-prisoner', {
        errors: [error],
        query: '',
      })

      expect(res.redirect).not.toHaveBeenCalled()
    })
  })
})
