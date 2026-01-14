import { Request, Response } from 'express'
import { when } from 'jest-when'
import AddPrisonerResultsHandler from './addPrisonerResults'
import OrchestratorService from '../../../services/orchestratorService'
import AuditService, { Action, Page, SubjectType } from '../../../services/auditService'
import TestData from '../../../testutils/testData'

jest.mock('../../../services/orchestratorService')
jest.mock('../../../services/auditService')

const orchestratorService = new OrchestratorService(null)
const auditService = new AuditService(null)

describe('AddPrisonerResultsHandler', () => {
  let handler: AddPrisonerResultsHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new AddPrisonerResultsHandler(orchestratorService, auditService)
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
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      // TODO: Add detailed checks for other tests that call the audit service

      expect(auditService.logPageView).toHaveBeenCalledWith(
        Page.ADD_PRISONER_RESULTS,
        expect.objectContaining({
          who: expect.any(String),
          what: Action.VIEW_SEARCH_RESULT,
          subjectType: SubjectType.PRISONER_ID,
          details: expect.any(Object),
        }),
      )

      expect(res.render).toHaveBeenCalledWith('pages/register/add-prisoner-results', {
        prisoners: TestData.Prisoners(),
        query: 'test',
      })
    })
  })

  describe('POST', () => {
    it('should redirect after processing', async () => {
      await handler.POST(req as Request, res as Response)
      expect(req.session!.selectedPrisoner).toStrictEqual(TestData.Prisoner())
      expect(res.redirect).toHaveBeenCalledWith('end-date')
    })
  })
})
