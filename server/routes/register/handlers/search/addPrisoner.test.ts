import { Request, Response } from 'express'
import { when } from 'jest-when'
import AddPrisonerHandler from './addPrisoner'
import * as auditUtils from '../../../../utils/auditUtils'
import validateForm from './addPrisonerValidation'
import TestData from '../../../../testutils/testData'
import { Page, Action, SubjectType } from '../../../../services/auditService'

jest.mock('./addPrisonerValidation')
jest.mock('../../../../utils/auditUtils')

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
      locals: {
        user: TestData.PrisonUser(),
      },
    }

    jest.mocked(auditUtils.auditPageAction).mockResolvedValue(undefined)
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

    it('should call audit service with correct parameters', async () => {
      req.body = { query: 'G4529UP' }
      when(validateForm).calledWith({ query: 'G4529UP' }).mockReturnValue(null)

      await handler.POST(req as Request, res as Response)

      expect(auditUtils.auditPageAction).toHaveBeenCalledWith(
        req,
        Page.ADD_PRISONER,
        Action.SEARCH_PRISONER,
        { query: 'G4529UP' },
        SubjectType.SEARCH_TERM,
      )
    })
  })
  it('starts a new registration without changing other journeys or authentication', async () => {
    req.session = {
      registerJourney: { prisoner: TestData.Prisoner(), searchQuery: 'test', startDate: '2026-01-20' },
      registerConfirmation: { prisoner: TestData.Prisoner(), startDate: '2026-01-20' },
      selectedDate: 'other journey date',
      returnTo: '/authentication-return',
    } as Request['session']
    await handler.startNewRegistration(req as Request, res as Response)
    expect(req.session.registerJourney).toBeUndefined()
    expect(req.session.registerConfirmation).toBeUndefined()
    expect(req.session.selectedDate).toBe('other journey date')
    expect(req.session.returnTo).toBe('/authentication-return')
    expect(res.redirect).toHaveBeenCalledWith('add-prisoner')
  })
})
