import { Request, Response } from 'express'
import createError from 'http-errors'
import { format, parse } from 'date-fns'
import { FormError } from '../../../@types/template'
import { currencyFromPence } from '../../../utils/currencyUtils'
import validateForm from './cancelRateChangeValidation'
import PrisonerPayService from '../../../services/prisonerPayService'
import OrchestratorService from '../../../services/orchestratorService'
import { auditPageAction, auditPageView } from '../../../utils/auditUtils'
import { Action, Page, SubjectType } from '../../../services/auditService'
import { findError, getSingleParam } from '../../../utils/utils'

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

  private render = (res: Response, payAmount: number, selectedDate: Date, choice?: string, errors: FormError[] = []) =>
    res.render('pages/changePayRate/cancel-rate-change', {
      payAmount,
      selectedDate,
      choice,
      errors,
      radios: {
        name: 'choice',
        classes: 'govuk-radios--inline',
        legend: 'Are you sure you want to cancel the pay rate change?',
        hint: {
          text: `The pay rate is set to change to ${currencyFromPence(payAmount)} per day from ${format(selectedDate, 'EEEE, d MMMM yyyy')}.`,
        },
        value: choice,
        errorMessage: findError(errors, 'choice'),
        items: [
          { value: 'yes', text: 'Yes' },
          { value: 'no', text: 'No' },
        ],
      },
    })

  GET = async (req: Request, res: Response) => {
    const rateChange = await this.getRateChange(req, res)
    const selectedDate = parse(rateChange.startDate, 'yyyy-MM-dd', new Date())

    await auditPageView(req, Page.CANCEL_RATE_CHANGE, { payAmount: rateChange.rate, selectedDate })

    return this.render(res, rateChange.rate, selectedDate)
  }

  POST = async (req: Request, res: Response) => {
    const { choice } = req.body

    const errors = validateForm(choice)
    if (errors) {
      const rateChange = await this.getRateChange(req, res)

      return this.render(res, rateChange.rate, parse(rateChange.startDate, 'yyyy-MM-dd', new Date()), choice, [errors])
    }

    if (choice === `yes`) {
      const rateChange = await this.getRateChange(req, res)

      await this.prisonerPayService.cancelRateChange(rateChange.id)
      await auditPageAction(
        req,
        Page.CANCEL_RATE_CHANGE,
        Action.CANCEL_RATE_CHANGE,
        {
          payRateId: rateChange.id,
          prisonCode: res.locals.user.activeCaseLoadId,
          payType: rateChange.type,
          payAmount: rateChange.rate,
          effectiveDate: rateChange.startDate,
        },
        SubjectType.NOT_APPLICABLE,
      )
      return res.redirectWithSuccess(
        '../../../pay-rates',
        'Pay rate updated',
        `You've cancelled the change to the pay rate for ${res.locals.payType.description}.`,
      )
    }
    return res.redirect('../../../pay-rates')
  }
}
