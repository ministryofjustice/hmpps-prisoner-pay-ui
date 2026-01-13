import { Request, Response } from 'express'
import { when } from 'jest-when'
import DashboardHandler from './dashboard'
import OrchestratorService from '../../../services/orchestratorService'
import TestData from '../../../testutils/testData'

jest.mock('../../../services/orchestratorService')
jest.mock('../../../services/auditService')

const orchestratorService = new OrchestratorService(null)

describe('GET /dashboard', () => {
  const handler = new DashboardHandler(orchestratorService)
  let req: Request
  let res: Response

  beforeEach(() => {
    res = {
      locals: {
        user: {
          activeCaseLoadId: 'MDI',
        },
      },
      render: jest.fn(),
    } as unknown as Response

    when(orchestratorService.getPayStatusPeriodsByType)
      .calledWith(expect.any(String), expect.any(String))
      .mockResolvedValue(TestData.PayStatusPeriods())
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render dashboard page', async () => {
    await handler.GET(req, res)
    expect(res.render).toHaveBeenCalledWith('pages/dashboard/dashboard', expect.any(Object))
  })
})
