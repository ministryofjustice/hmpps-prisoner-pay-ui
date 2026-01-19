import { Request, Response } from 'express'
import { when } from 'jest-when'
import PayOverviewHandler from './payOverview'
import OrchestratorService from '../../../services/orchestratorService'
import TestData from '../../../testutils/testData'
import * as auditUtils from '../../../utils/auditUtils'
import { Page, SubjectType } from '../../../services/auditService'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'

jest.mock('../../../services/orchestratorService')
jest.mock('../../../utils/auditUtils')

const orchestratorService = new OrchestratorService(null)

describe('PayOverviewHandler', () => {
  let handler: PayOverviewHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    jest.clearAllMocks()
    handler = new PayOverviewHandler(orchestratorService)
    req = {
      params: { payTypeSlug: 'long-term-sick' },
    }
    res = {
      locals: {
        user: TestData.PrisonUser(),
      },
      render: jest.fn(),
      redirect: jest.fn(),
    }

    jest.mocked(auditUtils.getDisplayedPaySummary).mockReturnValue({
      paySummaries: TestData.PayStatusPeriods().map(record => ({
        prisonerNumber: record.prisonerNumber,
        cellLocation: record.cellLocation,
        startDate: record.startDate,
        endDate: record.endDate,
      })),
      payType: getPayTypeBySlug('long-term-sick').type,
    })

    jest.mocked(auditUtils.auditPageView).mockResolvedValue(undefined)

    when(orchestratorService.getPayStatusPeriodsByType)
      .calledWith(expect.any(String), expect.any(String))
      .mockResolvedValue(TestData.PayStatusPeriods())
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/dashboard/pay-overview', {
        payType: getPayTypeBySlug('long-term-sick'),
        records: TestData.PayStatusPeriods(),
      })
    })

    it('should log page view to audit service with correct parameters', async () => {
      await handler.GET(req as Request, res as Response)
      expect(auditUtils.auditPageView).toHaveBeenCalledWith(
        req,
        Page.PAY_OVERVIEW,
        {
          paySummaries: TestData.PayStatusPeriods().map(record => ({
            prisonerNumber: record.prisonerNumber,
            cellLocation: record.cellLocation,
            startDate: record.startDate,
            endDate: record.endDate,
          })),
          payType: 'LONG_TERM_SICK',
        },
        SubjectType.PRISONER_ID,
      )
    })
  })
})
