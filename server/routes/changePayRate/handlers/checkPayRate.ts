import { parse } from 'date-fns'
import { Request, Response } from 'express'

export default class CheckPayRateHandler {
  constructor() {}

  GET = async (req: Request, res: Response) => {
    const { payAmount, selectedDate } = req.session!
    return res.render('pages/changePayRate/check-pay-rate', {
      payAmount,
      selectedDate: parse(selectedDate, 'dd/MM/yyyy', new Date()),
    })
  }

  POST = async (req: Request, res: Response) => {
    // TODO: Implement POST logic
    return res.redirect('')
  }
}
