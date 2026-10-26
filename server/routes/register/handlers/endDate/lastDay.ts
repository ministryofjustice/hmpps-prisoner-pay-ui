import { Request, Response } from 'express'
import { format, startOfToday } from 'date-fns'
import { formatDate } from '../../../../utils/utils'
import validateLastDay, { LastDayForm } from './lastDayValidation'
import { FormError } from '../../../../@types/template'
import getStatusDefinition from '../../../../statuses'
import buildLastDayPage from '../../viewModels/lastDay'
import { auditPageView } from '../../../../utils/auditUtils'
import { Page, SubjectType } from '../../../../services/auditService'

export default class LastDayHandler {
  private render = (req: Request, res: Response, form: LastDayForm, errors: FormError[] = []) => {
    const status = getStatusDefinition(res.locals.payType.type)
    return res.render(
      'pages/register/last-day',
      buildLastDayPage(status, { journey: req.session.registerJourney, form, errors }),
    )
  }

  GET = async (req: Request, res: Response) => {
    if (!req.session.registerJourney?.startDate) return res.redirect('start-date')
    if (req.session.registerJourney.endDateSelection !== 'yes') return res.redirect('end-date')
    const { prisoner } = req.session.registerJourney
    const { prisonerNumber } = prisoner
    req.session.registerJourney.returnTo = 'last-day'

    await auditPageView(req, Page.SET_END_DATE, {}, SubjectType.PRISONER_ID, null, prisonerNumber)

    return this.render(req, res, {
      selectedDate: req.session.registerJourney.endDate
        ? formatDate(req.session.registerJourney.endDate, 'dd/MM/yyyy')
        : undefined,
    })
  }

  POST = async (req: Request, res: Response) => {
    if (!req.session.registerJourney?.startDate) return res.redirect('start-date')
    if (req.session.registerJourney.endDateSelection !== 'yes') return res.redirect('end-date')
    const form: LastDayForm = { selectedDate: req.body.selectedDate }
    const status = getStatusDefinition(res.locals.payType.type)
    const result = validateLastDay(form, status.lastDay, {
      startDate: req.session.registerJourney.startDate,
      today: startOfToday(),
    })
    if (result.valid === false) {
      return this.render(req, res, { selectedDate: form.selectedDate || '' }, result.errors)
    }

    req.session.registerJourney.endDate = format(result.date, 'yyyy-MM-dd')
    return res.redirect('check')
  }
}
