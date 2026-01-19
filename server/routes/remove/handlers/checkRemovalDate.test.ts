import { Request, Response } from 'express'
import { when } from 'jest-when'
import CheckRemovalDateHandler from './checkRemovalDate'
import OrchestratorService from '../../../services/orchestratorService'
import PrisonerPayService from '../../../services/prisonerPayService'
import * as auditUtils from '../../../utils/auditUtils'
import TestData from '../../../testutils/testData'
import { Action, Page, SubjectType } from '../../../services/auditService'

jest.mock('../../../services/orchestratorService')
jest.mock('../../../services/prisonerPayService')
jest.mock('../../../utils/auditUtils')

const orchestratorService = new OrchestratorService(null)
const prisonerPayService = new PrisonerPayService(null)

describe('CheckRemovalDateHandler', () => {
  let handler: CheckRemovalDateHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    jest.clearAllMocks()
    handler = new CheckRemovalDateHandler(orchestratorService, prisonerPayService)
    req = {
      params: { payStatusId: '123', payTypeSlug: 'long-term-sick' },
      session: { selectedDate: '25/12/2025' },
    } as unknown as Request
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      locals: {
        user: TestData.PrisonUser(),
      },
    }

    when(orchestratorService.getPayStatusPeriodById).calledWith('123').mockResolvedValue(TestData.PayStatusPeriod())
    when(prisonerPayService.patchPayStatusPeriod)
      .calledWith('123', expect.any(Object))
      .mockResolvedValue(TestData.PayStatusPeriod())

    jest.mocked(auditUtils.auditPageView).mockResolvedValue(undefined)
    jest.mocked(auditUtils.auditPageAction).mockResolvedValue(undefined)
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith(
        'pages/remove/check-removal-date',
        expect.objectContaining({
          payStatusPeriod: TestData.PayStatusPeriod(),
          selectedDate: expect.any(String),
        }),
      )
    })

    it('should call audit page view with correct parameters', async () => {
      await handler.GET(req as Request, res as Response)

      expect(auditUtils.auditPageView).toHaveBeenCalledWith(
        req,
        Page.CHECK_REMOVE_PAY,
        {
          payType: 'LONG_TERM_SICK',
          selectedDate: expect.any(Date),
        },
        SubjectType.PRISONER_ID,
        null,
        TestData.PayStatusPeriod().prisonerNumber,
      )
    })
  })

  describe('POST', () => {
    it('should redirect after processing', async () => {
      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalled()
    })

    it('should call audit page action with correct parameters', async () => {
      await handler.POST(req as Request, res as Response)

      expect(auditUtils.auditPageAction).toHaveBeenCalledWith(req, Page.CHECK_REMOVE_PAY, Action.EDIT_STATUS_PERIOD, {
        payType: 'LONG_TERM_SICK',
        payStatusId: '123',
        selectedDate: expect.any(Date),
      })
    })
  })
})
