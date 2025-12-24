import { Request, Response } from 'express'
import { when } from 'jest-when'
import ConfirmRemovalDateHandler from './confirmRemovalDate'
import OrchestratorService from '../../../services/orchestratorService'
import TestData from '../../../testutils/testData'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'

jest.mock('../../../services/orchestratorService')

const orchestratorService = new OrchestratorService(null)

describe('ConfirmRemovalDateHandler', () => {
  let handler: ConfirmRemovalDateHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new ConfirmRemovalDateHandler(orchestratorService)
    req = {
      params: { payStatusId: '123', payTypeSlug: 'long-term-sick' },
      session: { selectedDate: '25/12/2025' },
    } as unknown as Request
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
    }

    when(orchestratorService.getPayStatusPeriodById).calledWith('123').mockReturnValue(TestData.PayStatusPeriod())
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith(
        'pages/remove/confirm-removal-date',
        expect.objectContaining({
          payStatusPeriod: TestData.PayStatusPeriod(),
          payType: getPayTypeBySlug('long-term-sick'),
          selectedDate: expect.any(Date),
        }),
      )
    })
  })

  describe('POST', () => {
    it('should redirect after processing', async () => {
      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalled()
    })
  })
})
