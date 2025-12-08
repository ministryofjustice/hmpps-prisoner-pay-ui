import { Request, Response } from 'express'
import DashboardHandler from './dashboard'
import OrchestratorService from '../../../services/orchestratorService'

jest.mock('../../../services/orchestratorService')
jest.mock('../../../services/auditService')

const orchestratorService = new OrchestratorService(null)

describe('GET /dashboard', () => {
  const handler = new DashboardHandler(orchestratorService)
  let req: Request
  let res: Response

  beforeEach(() => {
    res = {
      render: jest.fn(),
    } as unknown as Response
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render dashboard page', async () => {
    await handler.GET(req, res)
    expect(res.render).toHaveBeenCalledWith('pages/dashboard/dashboard', expect.any(Object))
  })
})
