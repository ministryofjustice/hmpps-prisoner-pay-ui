import { Request, Response } from 'express'
import OrchestratorService from '../../../services/orchestratorService'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'
import { ServiceUser } from '../../../@types/express'

export default class PayOverviewHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const { user } = res.locals
    const { payTypeSlug } = req.params
    const payType = getPayTypeBySlug(payTypeSlug)
    const paySummary = (await this.orchestratorService.getPayStatusPeriodsByType(payType.type, user)).filter(
      period => period.type === payType.type,
    )
    return res.render('pages/dashboard/pay-overview', {
      payType,
      records: paySummary,
    })
  }
}
