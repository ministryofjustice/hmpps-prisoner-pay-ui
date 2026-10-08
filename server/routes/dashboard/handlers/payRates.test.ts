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

    when(orchestratorService.getPayRates).calledWith('MDI').mockResolvedValue([TestData.PayRate()])

    jest.mocked(auditUtils.auditPageView).mockResolvedValue(undefined)
  })

  describe('GET', () => {
    it('should use the future rate UUID for cancellation and retain the current amount', async () => {
      const futureRate = {
        ...TestData.PayRate(),
        id: 'f7a138e6-7f9e-4336-8494-890d6b3d0a97',
        startDate: '2999-01-01',
        rate: 500,
      }
      jest.mocked(orchestratorService.getPayRates).mockResolvedValueOnce([futureRate, TestData.PayRate()])

      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/dashboard/pay-rates', {
        payTypes: expect.arrayContaining([
          expect.objectContaining({ currentRate: 99, scheduledRateId: futureRate.id }),
        ]),
      })
    })

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
          scheduledRateId: undefined as string | undefined,
        }
      })

      expect(res.render).toHaveBeenCalledWith('pages/dashboard/pay-rates', {
        payTypes: expectedPayTypeData,
      })
    })
  })
})
