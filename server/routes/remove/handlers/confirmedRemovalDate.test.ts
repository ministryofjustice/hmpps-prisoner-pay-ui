import { Request, Response } from 'express'
import { when } from 'jest-when'
import ConfirmedRemovalDateHandler from './confirmedRemovalDate'
import OrchestratorService from '../../../services/orchestratorService'
import TestData from '../../../testutils/testData'

jest.mock('../../../services/orchestratorService')

const orchestratorService = new OrchestratorService(null)

describe('ConfirmedRemovalDateHandler', () => {
  let handler: ConfirmedRemovalDateHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new ConfirmedRemovalDateHandler(orchestratorService)
    req = {
      params: { payStatusId: '123', payTypeSlug: 'long-term-sick' },
      session: { selectedDate: '25/12/2025' },
    } as unknown as Request
    res = {
      render: jest.fn(),
    }

    when(orchestratorService.getPayStatusPeriodById).calledWith('123').mockResolvedValue(TestData.PayStatusPeriod())
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith(
        'pages/remove/confirmed-removal-date',
        expect.objectContaining({
          payStatusPeriod: TestData.PayStatusPeriod(),
          selectedDate: expect.any(Date),
        }),
      )
    })
  })
})
