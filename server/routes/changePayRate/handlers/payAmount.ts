import { Request, Response } from 'express'

export default class PayAmountHandler {
  constructor() {}

  GET = async (req: Request, res: Response) => {
    return res.render('pages/changePayRate/pay-amount', {})
  }

  POST = async (req: Request, res: Response) => {
    // TODO: Implement POST logic
    return res.redirect('')
  }
}
