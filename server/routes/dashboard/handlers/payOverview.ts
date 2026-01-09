import { Request, Response } from 'express'
import { format } from 'date-fns'
import OrchestratorService from '../../../services/orchestratorService'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'

export default class PayOverviewHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const { activeCaseLoadId } = res.locals.user
    const { payTypeSlug } = req.params
    const payType = getPayTypeBySlug(payTypeSlug)
    const paySummary = (
      await this.orchestratorService.getPayStatusPeriodsByType(format(new Date(), 'yyyy-MM-dd'), activeCaseLoadId)
    ).filter(period => period.type === payType.type)
    return res.render('pages/dashboard/pay-overview', {
      payType,
      records: paySummary,
    })
  }
}
