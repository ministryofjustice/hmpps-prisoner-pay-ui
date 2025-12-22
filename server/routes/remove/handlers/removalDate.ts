import { Request, Response } from 'express'
import OrchestratorService from '../../../services/orchestratorService'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'

export default class RemovalDateHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const { payStatusId } = req.params
    const payStatusPeriod = await this.orchestratorService.getPayStatusPeriodById(payStatusId)
    const prisoner = await this.orchestratorService.getPrisonerByPrisonerNumber(payStatusPeriod.prisonerNumber)
    const payType = getPayTypeBySlug(req.params.payTypeSlug)

    return res.render('pages/remove/removal-date', {
      payStatusPeriod,
      prisoner,
      payType,
    })
  }

  POST = async (req: Request, res: Response) => {
    // TODO: Implement POST logic
    return res.redirect('')
  }
}
