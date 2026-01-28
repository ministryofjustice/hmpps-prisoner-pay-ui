import { Request, Response } from 'express'
import { parse } from 'date-fns'
import validateForm from './cancelValidation'

export default class CancelRateChangeHandler {
  constructor() {}

  GET = async (req: Request, res: Response) => {
    const { payAmount, selectedDate } = req.session!
    return res.render('pages/changePayRate/cancel-rate-change', {
      payAmount,
      selectedDate,
    })
  }

  POST = async (req: Request, res: Response) => {
    const { choice } = req.body

    const errors = validateForm(choice)
    if (errors) {
      const { payAmount, selectedDate } = req.session!
      return res.render('pages/register/cancel', {
        errors: [errors],
        choice,
        payAmount,
        selectedDate: parse(selectedDate, 'dd/MM/yyyy', new Date()),
      })
    }

    if (choice === `yes`) {
      // TODO: implement cancellation logic
    }
    return res.redirect('../../pay-rates')
  }
}
