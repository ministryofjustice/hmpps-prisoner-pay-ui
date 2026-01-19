import { Request, Response } from 'express'
import { when } from 'jest-when'
import ConfirmedRemovalDateHandler from './confirmedRemovalDate'
import OrchestratorService from '../../../services/orchestratorService'
import * as auditUtils from '../../../utils/auditUtils'
import TestData from '../../../testutils/testData'
import { Page, SubjectType } from '../../../services/auditService'

jest.mock('../../../services/orchestratorService')
jest.mock('../../../utils/auditUtils')

const orchestratorService = new OrchestratorService(null)

describe('ConfirmedRemovalDateHandler', () => {
  let handler: ConfirmedRemovalDateHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    jest.clearAllMocks()
    handler = new ConfirmedRemovalDateHandler(orchestratorService)
    req = {
      params: { payStatusId: '123', payTypeSlug: 'long-term-sick' },
      session: { selectedDate: '25/12/2025' },
    } as unknown as Request
    res = {
      render: jest.fn(),
    }

    when(orchestratorService.getPayStatusPeriodById).calledWith('123').mockResolvedValue(TestData.PayStatusPeriod())

    jest.mocked(auditUtils.auditPageView).mockResolvedValue(undefined)
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith(
        'pages/remove/confirmed-removal-date',
        expect.objectContaining({
          payStatusPeriod: TestData.PayStatusPeriod(),
          selectedDate: expect.any(String),
        }),
      )
    })

    it('should call audit page view with correct parameters', async () => {
      await handler.GET(req as Request, res as Response)

      expect(auditUtils.auditPageView).toHaveBeenCalledWith(
        res,
        Page.CONFIRMED_REMOVE_DATE,
        {
          endDate: TestData.PayStatusPeriod().endDate,
          type: TestData.PayStatusPeriod().type,
        },
        SubjectType.PRISONER_ID,
        null,
        TestData.PayStatusPeriod().prisonerNumber,
      )
    })
  })
})
