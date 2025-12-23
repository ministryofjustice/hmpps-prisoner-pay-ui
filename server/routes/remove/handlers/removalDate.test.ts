import { Request, Response } from 'express'
import { when } from 'jest-when'
import RemovalDateHandler from './removalDate'
import OrchestratorService from '../../../services/orchestratorService'
import TestData from '../../../testutils/testData'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'

jest.mock('../../../services/orchestratorService')

const orchestratorService = new OrchestratorService(null)

describe('RemovalDateHandler', () => {
  let handler: RemovalDateHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new RemovalDateHandler(orchestratorService)
    req = {
      params: { payStatusId: '123', payTypeSlug: 'long-term-sick' },
    }
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
    }

    when(orchestratorService.getPayStatusPeriodById).calledWith('123').mockReturnValue(TestData.PayStatusPeriod())
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/remove/removal-date', {
        payStatusPeriod: TestData.PayStatusPeriod(),
        payType: getPayTypeBySlug('long-term-sick'),
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
