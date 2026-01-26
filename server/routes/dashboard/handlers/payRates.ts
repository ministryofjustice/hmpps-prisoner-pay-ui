import { Request, Response } from 'express'
import { format } from 'date-fns'
import { getAllPayTypes } from '../../../utils/payTypeUtils'
import OrchestratorService from '../../../services/orchestratorService'

export default class PayRatesHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const { activeCaseLoadId } = res.locals.user
    const payTypes = getAllPayTypes()
    const paySummary = await this.orchestratorService.getPayStatusPeriodsByType(
      format(new Date(), 'yyyy-MM-dd'),
      activeCaseLoadId,
    )
    const payRates = await this.orchestratorService.getPayRates()
    const payTypeData = payTypes.map(payType => {
      const records = paySummary.filter(period => period.type === payType.type)
      return {
        ...payType,
        numberOfPrisoners: records.length,
        currentRate: payRates.find(rate => rate.type === payType.type)?.rate || undefined,
      }
    })

    return res.render('pages/dashboard/pay-rates', {
      payTypes: payTypeData,
    })
  }
}
