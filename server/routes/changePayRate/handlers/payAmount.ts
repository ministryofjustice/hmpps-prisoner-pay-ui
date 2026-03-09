import { Request, Response } from 'express'
import validateForm from './payAmountValidation'
import OrchestratorService from '../../../services/orchestratorService'

export default class PayAmountHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    return res.render('pages/changePayRate/pay-amount', {})
  }

  POST = async (req: Request, res: Response) => {
    const { payAmount } = req.body
    const { payType } = res.locals
    const { dailyPayAmount, description } = payType
    const { activeCaseLoadId } = res.locals.user

    const errors = validateForm({ payAmount }, dailyPayAmount, description)

    if (errors) {
      return res.render('pages/changePayRate/pay-amount', { errors: [errors], payAmount })
    }

    const payRates = await this.orchestratorService.getPayRates(activeCaseLoadId)
    const payDetails = payRates.find(rate => rate.type === payType.type)

    req.session!.payAmount = payAmount
    req.session!.payRateId = payDetails.id

    return res.redirect('./set-change-date')
  }
}
