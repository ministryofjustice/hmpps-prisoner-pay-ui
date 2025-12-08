import { Request, Response } from 'express'
import LongTermSickHandler from './longTermSick'
import OrchestratorService from '../../../services/orchestratorService'

jest.mock('../../../services/orchestratorService')

const orchestratorService = new OrchestratorService(null)

describe('Long-term-sickHandler', () => {
  let handler: LongTermSickHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new LongTermSickHandler(orchestratorService)
    req = {}
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
    }
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)
      expect(res.render).toHaveBeenCalledWith('pages/dashboard/long-term-sick', expect.any(Object))
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
