import { Request, Response } from 'express'
import { when } from 'jest-when'
import AddPrisonerResultsHandler from './addPrisonerResults'
import OrchestratorService from '../../../../services/orchestratorService'
import * as auditUtils from '../../../../utils/auditUtils'
import TestData from '../../../../testutils/testData'
import { Action, Page, SubjectType } from '../../../../services/auditService'

jest.mock('../../../../services/orchestratorService')
jest.mock('../../../../utils/auditUtils')

const orchestratorService = new OrchestratorService(null)

describe('AddPrisonerResultsHandler', () => {
  let handler: AddPrisonerResultsHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    jest.clearAllMocks()
    handler = new AddPrisonerResultsHandler(orchestratorService)
    req = {
      params: { payTypeSlug: 'long-term-sick' },
      query: {
        query: 'test',
      },
      body: {
        selectedPrisoner: 'G4529UP',
      },
      session: {},
    } as unknown as Partial<Request>

    res = {
      locals: {
        user: TestData.PrisonUser(),
      },
      render: jest.fn(),
      redirect: jest.fn(),
    }

    when(orchestratorService.searchPrisoners)
      .calledWith('test', expect.any(String))
      .mockResolvedValue(TestData.Prisoners())

    jest.mocked(auditUtils.getDisplayedResults).mockReturnValue({
      searchResults: TestData.Prisoners().map(prisoner => ({
        prisonerNumber: prisoner.prisonerNumber,
        cellLocation: prisoner.cellLocation,
      })),
    })
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/register/add-prisoner-results', {
        prisoners: TestData.Prisoners(),
        query: 'test',
        errors: [],
      })
    })

    it('should call audit page view with correct parameters', async () => {
      await handler.GET(req as Request, res as Response)

      expect(auditUtils.auditPageView).toHaveBeenCalledWith(
        req,
        Page.ADD_PRISONER_RESULTS,
        expect.any(Object),
        SubjectType.PRISONER_ID,
        Action.VIEW_SEARCH_RESULT,
      )
    })
  })

  describe('POST', () => {
    it.each([
      ['an altered prisoner number', 'UNKNOWN', TestData.Prisoners()],
      ['a stale selection after results become empty', 'G4529UP', []],
      ['a stale selection after results change', 'G4529UP', [TestData.Prisoners()[1]]],
    ])('redisplays refreshed results for %s without changing the journey', async (_description, selection, results) => {
      req.body.selectedPrisoner = selection
      req.session.registerJourney = {
        prisoner: TestData.Prisoner(),
        searchQuery: 'test',
        startDate: '2026-01-20',
      }
      const previousJourney = { ...req.session.registerJourney }
      jest.mocked(orchestratorService.searchPrisoners).mockResolvedValueOnce(results)

      await handler.POST(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/register/add-prisoner-results', {
        errors: [{ href: '#selectedPrisoner', text: 'Select someone from the current search results' }],
        selectedPrisoner: selection,
        query: 'test',
        prisoners: results,
      })
      expect(req.session.registerJourney).toEqual(previousJourney)
      expect(res.redirect).not.toHaveBeenCalled()
    })

    it('retains the required-selection error when nothing is submitted', async () => {
      delete req.body.selectedPrisoner
      await handler.POST(req as Request, res as Response)
      expect(res.render).toHaveBeenCalledWith(
        'pages/register/add-prisoner-results',
        expect.objectContaining({
          errors: [{ href: '#selectedPrisoner', text: 'You must select someone' }],
        }),
      )
      expect(req.session.registerJourney).toBeUndefined()
      expect(res.redirect).not.toHaveBeenCalled()
    })

    it('should redirect after processing', async () => {
      await handler.POST(req as Request, res as Response)
      expect(req.session.registerJourney.prisoner).toStrictEqual(TestData.Prisoner())
      expect(res.redirect).toHaveBeenCalledWith('start-date')
    })

    it('should call audit page action with correct parameters', async () => {
      await handler.POST(req as Request, res as Response)

      expect(auditUtils.auditPageAction).toHaveBeenCalledWith(
        req,
        Page.ADD_PRISONER,
        Action.SEARCH_PRISONER,
        { query: 'test' },
        SubjectType.SEARCH_TERM,
      )
    })
  })
  it('preserves date choices when returning through search results for the same prisoner', async () => {
    req.session.registerJourney = { prisoner: TestData.Prisoner(), searchQuery: 'test' }
    req.session.registerJourney.startDate = '2026-01-20'
    req.session.registerJourney.startDateOption = 'other'
    await handler.POST(req as Request, res as Response)
    expect(req.session.registerJourney.startDate).toBe('2026-01-20')
    expect(req.session.registerJourney.startDateOption).toBe('other')
  })

  it('starts a fresh draft when a different prisoner is selected', async () => {
    req.session.registerJourney = {
      prisoner: { ...TestData.Prisoner(), prisonerNumber: 'OTHER' },
      searchQuery: 'test',
      startDate: '2026-01-20',
      startDateOption: 'other',
      endDate: '2026-01-21',
      endDateSelection: 'yes',
      returnTo: 'check',
    }
    await handler.POST(req as Request, res as Response)
    expect(req.session.registerJourney).toEqual({ prisoner: TestData.Prisoner(), searchQuery: 'test' })
  })
})
