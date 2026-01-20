import { Request, Response } from 'express'
import validateForm from './payAmountValidation'

export default class PayAmountHandler {
  constructor() {}

  GET = async (req: Request, res: Response) => {
    return res.render('pages/changePayRate/pay-amount', {})
  }

  POST = async (req: Request, res: Response) => {
    const { payAmount } = req.body
    const { dailyPayAmount, description } = res.locals.payType

    const errors = validateForm({ payAmount }, dailyPayAmount, description)

    if (errors) {
      return res.render('pages/changePayRate/pay-amount', { errors: [errors], payAmount })
    }

    // TODO: Implement POST logic
    return res.redirect('')
  }
}
