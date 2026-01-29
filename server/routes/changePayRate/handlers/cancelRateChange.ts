import { Request, Response } from 'express'
import { parse } from 'date-fns'
import validateForm from './cancelRateChangeValidation'
import OrchestratorService from '../../../services/orchestratorService'

export default class CancelRateChangeHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const rateChange = await this.orchestratorService.getPayRateById(req.params.rateId)
    return res.render('pages/changePayRate/cancel-rate-change', {
      payAmount: rateChange.rate,
      selectedDate: parse(rateChange.startDate, 'yyyy-MM-dd', new Date()),
    })
  }

  POST = async (req: Request, res: Response) => {
    const { choice } = req.body

    const errors = validateForm(choice)
    if (errors) {
      const rateChange = await this.orchestratorService.getPayRateById(req.params.rateId)
      console.log(errors)

      return res.render('pages/changePayRate/cancel-rate-change', {
        errors: [errors],
        choice,
        payAmount: rateChange.rate,
        selectedDate: parse(rateChange.startDate, 'yyyy-MM-dd', new Date()),
      })
    }

    if (choice === `yes`) {
      // TODO: implement cancellation logic
      return res.redirectWithSuccess(
        '../../../pay-rates',
        'Pay rate updated',
        "You've cancelled the change to the pay rate for Long-term sick.",
      )
    }
    return res.redirect('../../../pay-rates')
  }
}
