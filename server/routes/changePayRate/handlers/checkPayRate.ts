import { format, parse } from 'date-fns'
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
    const { selectedDate } = req.session!
    const { payType } = res.locals
    const parsedDate = parse(selectedDate, 'dd/MM/yyyy', new Date())

    // TODO: Add request to submit the pay rate change
    // For now, just redirect to the pay rates page

    const successMessage = `You've updated the pay for ${payType.description}. The change will take effect from ${format(parsedDate, 'd MMMM yyyy')}.`
    return res.redirectWithSuccess('../../pay-rates', 'Pay rate updated', successMessage)
  }
}
