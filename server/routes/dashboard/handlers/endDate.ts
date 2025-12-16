import { Request, Response } from 'express'
import OrchestratorService from '../../../services/orchestratorService'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'

export default class EndDateHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const { payTypeSlug } = req.params
    const payType = getPayTypeBySlug(payTypeSlug)
    const paySummary = this.orchestratorService.getPaySummaryByType(payType.type)
    return res.render('pages/dashboard/end-date', {
      payType: paySummary,
      records: paySummary.registeredPrisoners,
    })
  }

  POST = async (req: Request, res: Response) => {
    // TODO: Implement POST logic

    return res.redirect('/LTS-check-and-confirm')
  }
}
