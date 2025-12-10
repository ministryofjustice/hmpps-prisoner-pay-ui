import { Request, Response } from 'express'
import { when } from 'jest-when'
import PayOverviewHandler from './payOverview'
import OrchestratorService from '../../../services/orchestratorService'

jest.mock('../../../services/orchestratorService')

const orchestratorService = new OrchestratorService(null)

const paySummary = {
  id: 1,
  code: 'LTS',
  description: 'Long-term Sick',
  dailyPayAmount: 65,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registeredPrisoners: [] as any[],
}

describe('PayOverviewHandler', () => {
  let handler: PayOverviewHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new PayOverviewHandler(orchestratorService)
    req = {
      params: { payId: '1' },
    }
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
    }

    when(orchestratorService.getPaySummaryById).calledWith(1).mockReturnValue(paySummary)
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/dashboard/pay-overview', {
        payType: {
          id: 1,
          code: 'LTS',
          description: 'Long-term Sick',
          dailyPayAmount: 65,
          registeredPrisoners: [],
        },
        records: [],
      })
    })
  })

  describe('POST', () => {
    it('should redirect after processing', async () => {
      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalled()
    })
  })

  // TODO: Add more test cases
})
