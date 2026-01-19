import { Request, Response } from 'express'
import { when } from 'jest-when'
import AddPrisonerResultsHandler from './addPrisonerResults'
import OrchestratorService from '../../../services/orchestratorService'
import * as auditUtils from '../../../utils/auditUtils'
import TestData from '../../../testutils/testData'
import { Action, Page, SubjectType } from '../../../services/auditService'

jest.mock('../../../services/orchestratorService')
jest.mock('./addPrisonerResultsValidation')
jest.mock('../../../utils/auditUtils')

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
        res,
        Page.ADD_PRISONER_RESULTS,
        expect.any(Object),
        SubjectType.PRISONER_ID,
        Action.VIEW_SEARCH_RESULT,
      )
    })
  })

  describe('POST', () => {
    it('should redirect after processing', async () => {
      await handler.POST(req as Request, res as Response)
      expect(req.session!.selectedPrisoner).toStrictEqual(TestData.Prisoner())
      expect(res.redirect).toHaveBeenCalledWith('end-date')
    })

    it('should call audit page action with correct parameters', async () => {
      await handler.POST(req as Request, res as Response)

      expect(auditUtils.auditPageAction).toHaveBeenCalledWith(
        res,
        Page.ADD_PRISONER,
        Action.SEARCH_PRISONER,
        { query: 'test' },
        SubjectType.SEARCH_TERM,
      )
    })
  })
})
