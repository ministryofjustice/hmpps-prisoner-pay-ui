import { Request, Response } from 'express'
import { format } from 'date-fns'
import { getAllPayTypes } from '../../../utils/payTypeUtils'
import OrchestratorService from '../../../services/orchestratorService'
import { auditPageView } from '../../../utils/auditUtils'
import { Page } from '../../../services/auditService'

export default class PayRatesHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const { activeCaseLoadId } = res.locals.user
    const payTypes = getAllPayTypes()
    const paySummary = await this.orchestratorService.getPayStatusPeriodsByType(
      format(new Date(), 'yyyy-MM-dd'),
      activeCaseLoadId,
    )
    const payRates = await this.orchestratorService.getPayRates(activeCaseLoadId)
    const today = format(new Date(), 'yyyy-MM-dd')
    const payTypeData = payTypes.map(payType => {
      const records = paySummary.filter(period => period.type === payType.type)
      const rates = payRates.filter(rate => rate.type === payType.type)
      const currentRate = rates
        .filter(rate => rate.startDate <= today)
        .sort((a, b) => b.startDate.localeCompare(a.startDate))[0]
      const scheduledRate = rates
        .filter(rate => rate.startDate > today)
        .sort((a, b) => a.startDate.localeCompare(b.startDate))[0]
      return {
        ...payType,
        numberOfPrisoners: records.length,
        currentRate: currentRate?.rate,
        scheduledRateId: scheduledRate?.id,
      }
    })

    await auditPageView(req, Page.PAY_RATES, { payTypeData })

    return res.render('pages/dashboard/pay-rates', {
      payTypes: payTypeData,
    })
  }
}
