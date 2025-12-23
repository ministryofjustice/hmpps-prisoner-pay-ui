import { Request, Response } from 'express'
import { when } from 'jest-when'
import PayOverviewHandler from './payOverview'
import OrchestratorService from '../../../services/orchestratorService'
import TestData from '../../../testutils/testData'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'

jest.mock('../../../services/orchestratorService')

const orchestratorService = new OrchestratorService(null)

describe('PayOverviewHandler', () => {
  let handler: PayOverviewHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new PayOverviewHandler(orchestratorService)
    req = {
      params: { payTypeSlug: 'long-term-sick' },
    }
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
    }

    when(orchestratorService.getPayStatusPeriodsByType)
      .calledWith(expect.any(String))
      .mockReturnValue(TestData.PayStatusPeriods())
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/dashboard/pay-overview', {
        payType: getPayTypeBySlug('long-term-sick'),
        records: TestData.PayStatusPeriods(),
      })
    })
  })
})
