import { Request, Response } from 'express'
import { parse, format } from 'date-fns'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'
import OrchestratorService from '../../../services/orchestratorService'
import PrisonerPayService from '../../../services/prisonerPayService'

export default class CheckRemovalDateHandler {
  constructor(
    private readonly orchestratorService: OrchestratorService,
    private readonly prisonerPayService: PrisonerPayService,
  ) {}

  GET = async (req: Request, res: Response) => {
    const payType = getPayTypeBySlug(req.params.payTypeSlug)
    const selectedDate = parse(req.session!.selectedDate, 'dd/MM/yyyy', new Date())
    const { payStatusId } = req.params
    const payStatusPeriod = await this.orchestratorService.getPayStatusPeriodById(payStatusId)

    return res.render('pages/remove/check-removal-date', {
      payStatusPeriod,
      selectedDate,
      payType,
    })
  }

  POST = async (req: Request, res: Response) => {
    const { payStatusId } = req.params
    const selectedDate = parse(req.session!.selectedDate, 'dd/MM/yyyy', new Date())

    await this.prisonerPayService.patchPayStatusPeriod(payStatusId, {
      removalDate: format(selectedDate, 'yyyy-MM-dd'),
    })

    return res.redirect('')
  }
}
