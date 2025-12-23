import { Request, Response } from 'express'
import OrchestratorService from '../../../services/orchestratorService'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'

export default class PayOverviewHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const { payTypeSlug } = req.params
    const payType = getPayTypeBySlug(payTypeSlug)
    const paySummary = this.orchestratorService.getPayStatusPeriodsByType(payType.type)
    return res.render('pages/dashboard/pay-overview', {
      payType,
      records: paySummary,
    })
  }
}
