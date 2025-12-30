import { Request, Response } from 'express'
import { parse } from 'date-fns'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'
import OrchestratorService from '../../../services/orchestratorService'

export default class ConfirmedRemovalDateHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const payType = getPayTypeBySlug(req.params.payTypeSlug)
    const selectedDate = parse(req.session!.selectedDate, 'dd/MM/yyyy', new Date())
    const { payStatusId } = req.params
    const payStatusPeriod = await this.orchestratorService.getPayStatusPeriodById(payStatusId)

    return res.render('pages/remove/confirmed-removal-date', {
      payStatusPeriod,
      selectedDate,
      payType,
    })
  }
}
