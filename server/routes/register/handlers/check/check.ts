import { Request, Response } from 'express'
import { isToday, isTomorrow, parseISO } from 'date-fns'
import { getPayTypeBySlug } from '../../../../utils/payTypeUtils'
import { formatDate, formatFirstLastName, getSingleParam } from '../../../../utils/utils'
import PrisonerPayService from '../../../../services/prisonerPayService'
import { CreatePayStatusPeriodRequest } from '../../../../@types/prisonerPayAPI/types'
import { auditPageAction, auditPageView } from '../../../../utils/auditUtils'
import { Action, Page, SubjectType } from '../../../../services/auditService'
import { getRegisterJourneyRedirect } from '../../registerJourneyValidation'

const formatCheckDate = (date: string): string => {
  const parsedDate = parseISO(date)
  const fullDate = formatDate(date, 'd MMMM yyyy')
  if (isToday(parsedDate)) return `Today - ${fullDate}`
  if (isTomorrow(parsedDate)) return `Tomorrow - ${fullDate}`
  return fullDate
}

export default class CheckHandler {
  constructor(private readonly prisonerPayService: PrisonerPayService) {}

  GET = async (req: Request, res: Response) => {
    const journey = req.session.registerJourney
    const redirect = getRegisterJourneyRedirect(journey)
    if (redirect) return res.redirect(redirect)

    const { prisoner, startDate, endDate } = journey
    const { prisonerNumber } = prisoner
    const { type: payType } = getPayTypeBySlug(getSingleParam(req.params.payTypeSlug))
    journey.returnTo = 'check'

    await auditPageView(
      req,
      Page.CHECK_CONFIRM_PAY,
      { payType, startDate, endDate },
      SubjectType.PRISONER_ID,
      null,
      prisonerNumber,
    )

    return res.render('pages/register/check', {
      prisonerName: formatFirstLastName(prisoner.firstName, prisoner.lastName),
      prisoner,
      startDateText: formatCheckDate(startDate),
      previousPage: endDate ? 'last-day' : 'end-date',
      endDateText: endDate ? formatCheckDate(endDate) : 'None set',
    })
  }

  POST = async (req: Request, res: Response) => {
    const journey = req.session.registerJourney
    const redirect = getRegisterJourneyRedirect(journey)
    if (redirect) return res.redirect(redirect)

    const { prisoner, startDate, endDate } = journey
    const { prisonerNumber } = prisoner
    const { type: payType } = getPayTypeBySlug(getSingleParam(req.params.payTypeSlug))

    const postRequest: CreatePayStatusPeriodRequest = {
      prisonCode: res.locals.user.activeCaseLoadId,
      prisonerNumber,
      type: payType,
      startDate,
      endDate,
    } as CreatePayStatusPeriodRequest

    await this.prisonerPayService.postPayStatusPeriod(postRequest)
    req.session.registerConfirmation = { prisoner, startDate, endDate }
    delete req.session.registerJourney

    await auditPageAction(
      req,
      Page.CHECK_CONFIRM_PAY,
      Action.CREATE_STATUS_PERIOD,
      { payType, startDate, endDate },
      SubjectType.PRISONER_ID,
      prisonerNumber,
    )
    return res.redirect('confirmed-add-prisoner')
  }
}
