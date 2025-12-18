import { Request, Response } from 'express'
import { when } from 'jest-when'
import EndDateHandler from './endDate'
import OrchestratorService from '../../../services/orchestratorService'

jest.mock('../../../services/orchestratorService')

const orchestratorService = new OrchestratorService(null)

const paySummary = {
  id: 1,
  code: 'LTS',
  type: 'LONG_TERM_SICK',
  description: 'Long-term Sick',
  dailyPayAmount: 65,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registeredPrisoners: [] as any[],
}

describe('EndDateHandler', () => {
  let handler: EndDateHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new EndDateHandler(orchestratorService)
    req = {
      params: { payTypeSlug: 'long-term-sick' },
    }
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
    }

    when(orchestratorService.getPaySummaryByType).calledWith(expect.any(String)).mockReturnValue(paySummary)
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/dashboard/end-date', {
        prisoner: {
          cellLocation: 'COURT',
          firstName: 'NICAIGH',
          lastName: 'JOHNUSTINE',
          prisonerNumber: 'G4529UP',
          status: 'ACTIVE IN',
        },
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
