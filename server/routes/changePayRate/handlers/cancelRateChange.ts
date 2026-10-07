import { Request, Response } from 'express'
import createError from 'http-errors'
import { format, parse } from 'date-fns'
import validateForm from './cancelRateChangeValidation'
import PrisonerPayService from '../../../services/prisonerPayService'
import OrchestratorService from '../../../services/orchestratorService'
import { auditPageView } from '../../../utils/auditUtils'
import { Page } from '../../../services/auditService'
import { getSingleParam } from '../../../utils/utils'

export default class CancelRateChangeHandler {
  constructor(
    private readonly orchestratorService: OrchestratorService,
    private readonly prisonerPayService: PrisonerPayService,
  ) {}

  private async getRateChange(req: Request, res: Response) {
    const rates = await this.orchestratorService.getPayRates(res.locals.user.activeCaseLoadId)
    const today = format(new Date(), 'yyyy-MM-dd')
    const rateChange = rates.find(
      rate =>
        rate.id === getSingleParam(req.params.rateId) &&
        rate.type === res.locals.payType.type &&
        rate.startDate > today,
    )
    if (!rateChange) throw createError(404, 'Scheduled pay rate change not found')
    return rateChange
  }

  GET = async (req: Request, res: Response) => {
    const rateChange = await this.getRateChange(req, res)
    const selectedDate = parse(rateChange.startDate, 'yyyy-MM-dd', new Date())

    await auditPageView(req, Page.CANCEL_RATE_CHANGE, { payAmount: rateChange.rate, selectedDate })

    return res.render('pages/changePayRate/cancel-rate-change', {
      payAmount: rateChange.rate,
      selectedDate,
    })
  }

  POST = async (req: Request, res: Response) => {
    const { choice } = req.body

    const errors = validateForm(choice)
    if (errors) {
      const rateChange = await this.getRateChange(req, res)

      return res.render('pages/changePayRate/cancel-rate-change', {
        errors: [errors],
        choice,
        payAmount: rateChange.rate,
        selectedDate: parse(rateChange.startDate, 'yyyy-MM-dd', new Date()),
      })
    }

    if (choice === `yes`) {
      const rateChange = await this.getRateChange(req, res)
      await this.prisonerPayService.cancelRateChange(rateChange.id)
      return res.redirectWithSuccess(
        '../../../pay-rates',
        'Pay rate updated',
        "You've cancelled the change to the pay rate for Long-term sick.",
      )
    }
    return res.redirect('../../../pay-rates')
  }
}
