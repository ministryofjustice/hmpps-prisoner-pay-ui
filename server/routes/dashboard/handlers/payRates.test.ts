import { Request, Response } from 'express'
import { when } from 'jest-when'
import PayRatesHandler from './payRates'
import OrchestratorService from '../../../services/orchestratorService'
import TestData from '../../../testutils/testData'
import { getAllPayTypes } from '../../../utils/payTypeUtils'
import * as auditUtils from '../../../utils/auditUtils'

jest.mock('../../../services/orchestratorService')
jest.mock('../../../utils/auditUtils')

const orchestratorService = new OrchestratorService(null)

describe('PayRatesHandler', () => {
  let handler: PayRatesHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new PayRatesHandler(orchestratorService)
    req = {}
    res = {
      locals: {
        user: TestData.PrisonUser(),
      },
      render: jest.fn(),
      redirect: jest.fn(),
    }

    when(orchestratorService.getPayStatusPeriodsByType)
      .calledWith(expect.any(String), expect.any(String))
      .mockResolvedValue(TestData.PayStatusPeriods())

    when(orchestratorService.getPayRates).calledWith().mockResolvedValue([TestData.PayRate()])

    jest.mocked(auditUtils.auditPageView).mockResolvedValue(undefined)
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      const payTypes = getAllPayTypes()
      const paySummary = TestData.PayStatusPeriods()
      const expectedPayTypeData = payTypes.map(payType => {
        const records = paySummary.filter(period => period.type === payType.type)
        return {
          ...payType,
          numberOfPrisoners: records.length,
          currentRate: TestData.PayRate().rate,
        }
      })

      expect(res.render).toHaveBeenCalledWith('pages/dashboard/pay-rates', {
        payTypes: expectedPayTypeData,
      })
    })
  })
})
