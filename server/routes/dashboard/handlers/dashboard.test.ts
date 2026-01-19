import { Request, Response } from 'express'
import { when } from 'jest-when'
import DashboardHandler from './dashboard'
import OrchestratorService from '../../../services/orchestratorService'
import TestData from '../../../testutils/testData'
import * as auditUtils from '../../../utils/auditUtils'
import { Page } from '../../../services/auditService'

jest.mock('../../../services/orchestratorService')
jest.mock('../../../utils/auditUtils')

const orchestratorService = new OrchestratorService(null)

describe('GET /dashboard', () => {
  const handler = new DashboardHandler(orchestratorService)
  let req: Request
  let res: Response

  beforeEach(() => {
    res = {
      locals: {
        user: TestData.PrisonUser(),
      },
      render: jest.fn(),
    } as unknown as Response

    when(orchestratorService.getPayStatusPeriodsByType)
      .calledWith(expect.any(String), expect.any(String))
      .mockResolvedValue(TestData.PayStatusPeriods())

    jest.mocked(auditUtils.auditPageView).mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render dashboard page', async () => {
    await handler.GET(req, res)
    expect(res.render).toHaveBeenCalledWith('pages/dashboard/dashboard', expect.any(Object))
  })

  it('should log page view to audit service with correct parameters', async () => {
    await handler.GET(req, res)
    expect(auditUtils.auditPageView).toHaveBeenCalledWith(req, Page.DASHBOARD, {
      payTypes: expect.any(Array),
      prisonPopulation: 1000,
    })
  })
})
