import { Request, Response } from 'express'
import OrchestratorService from '../../../services/orchestratorService'

export default class PayOverviewHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const { payId } = req.params
    const paySummary = this.orchestratorService.getPaySummaryById(Number(payId))
    return res.render('pages/dashboard/pay-overview', {
      payType: paySummary,
      records: paySummary.registeredPrisoners,
    })
  }

  POST = async (req: Request, res: Response) => {
    // TODO: Implement POST logic
    return res.redirect('')
  }
}
