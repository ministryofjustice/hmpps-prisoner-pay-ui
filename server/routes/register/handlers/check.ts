import { Request, Response } from 'express'
import { format, parse, parseISO, isValid, startOfToday } from 'date-fns'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'
import { formatFirstLastName, getSingleParam } from '../../../utils/utils'
import PrisonerPayService from '../../../services/prisonerPayService'
import { CreatePayStatusPeriodRequest } from '../../../@types/prisonerPayAPI/types'
import { auditPageAction, auditPageView } from '../../../utils/auditUtils'
import { Action, Page, SubjectType } from '../../../services/auditService'
import validateEndDate from './endDateValidation'

export default class CheckHandler {
  constructor(private readonly prisonerPayService: PrisonerPayService) {}

  GET = async (req: Request, res: Response) => {
    if (!req.session.registerJourney) return res.redirect('add-prisoner')
    const { startDate, endDateSelection, endDate } = req.session.registerJourney
    if (!startDate || !isValid(parseISO(startDate)) || parseISO(startDate) < startOfToday())
      return res.redirect('start-date')
    if (validateEndDate(endDateSelection, endDate, startDate)) return res.redirect('end-date')
    const { prisoner } = req.session.registerJourney
    const { prisonerNumber } = prisoner
    const { endDate: selectedDate } = req.session.registerJourney
    const { type: payType } = getPayTypeBySlug(getSingleParam(req.params.payTypeSlug))
    req.session.registerJourney.returnTo = 'check'

    await auditPageView(
      req,
      Page.CHECK_CONFIRM_PAY,
      { payType, startDate, endDate: selectedDate },
      SubjectType.PRISONER_ID,
      null,
      prisonerNumber,
    )

    return res.render('pages/register/check', {
      prisonerName: formatFirstLastName(prisoner.firstName, prisoner.lastName),
      prisoner,
      selectedDate,
      startDate,
    })
  }

  POST = async (req: Request, res: Response) => {
    if (!req.session.registerJourney) return res.redirect('add-prisoner')

    const { startDate, endDateSelection, endDate } = req.session.registerJourney
    if (!startDate || !isValid(parseISO(startDate)) || parseISO(startDate) < startOfToday())
      return res.redirect('start-date')

    if (validateEndDate(endDateSelection, endDate, startDate)) return res.redirect('end-date')

    const { prisoner } = req.session.registerJourney
    const { prisonerNumber } = prisoner
    const { type: payType } = getPayTypeBySlug(getSingleParam(req.params.payTypeSlug))
    const { endDate: selectedDate } = req.session.registerJourney

    const postRequest: CreatePayStatusPeriodRequest = {
      prisonCode: res.locals.user.activeCaseLoadId,
      prisonerNumber,
      type: payType,
      startDate,
      endDate: selectedDate ? format(parse(selectedDate, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd') : undefined,
    } as CreatePayStatusPeriodRequest

    await this.prisonerPayService.postPayStatusPeriod(postRequest)
    req.session.registerConfirmation = { prisoner, startDate, endDate: selectedDate }
    delete req.session.registerJourney

    await auditPageAction(
      req,
      Page.CHECK_CONFIRM_PAY,
      Action.CREATE_STATUS_PERIOD,
      { payType, startDate, endDate: selectedDate },
      SubjectType.PRISONER_ID,
      prisonerNumber,
    )
    return res.redirect('confirmed-add-prisoner')
  }
}
