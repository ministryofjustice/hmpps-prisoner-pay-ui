import { Request, Response } from 'express'
import DashboardHandler from './dashboard'

jest.mock('../../../services/auditService')

describe('GET /dashboard', () => {
  const handler = new DashboardHandler()
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
