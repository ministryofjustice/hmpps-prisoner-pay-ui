import { Request, Response } from 'express'
import { format } from 'date-fns'
import OrchestratorService from '../../../services/orchestratorService'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'
import validateForm from './removalDateValidation'

export default class RemovalDateHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const { payStatusId } = req.params
    const payStatusPeriod = await this.orchestratorService.getPayStatusPeriodById(payStatusId)
    const payType = getPayTypeBySlug(req.params.payTypeSlug)

    return res.render('pages/remove/removal-date', {
      payStatusPeriod,
      payType,
    })
  }

  POST = async (req: Request, res: Response) => {
    const { removalDateOption, removalDate } = req.body

    const errors = validateForm({ removalDateOption, removalDate })
    if (errors) {
      const { payStatusId } = req.params
      const payStatusPeriod = await this.orchestratorService.getPayStatusPeriodById(payStatusId)
      const payType = getPayTypeBySlug(req.params.payTypeSlug)
      return res.render('pages/remove/removal-date', {
        payStatusPeriod,
        payType,
        errors: [errors],
        removalDateOption,
        removalDate,
      })
    }

    req.session!.selectedDate = removalDateOption === 'today' ? format(new Date(), 'dd/MM/yyyy') : removalDate
    return res.redirect('./check-removal-date')
  }
}
