import { Request, Response } from 'express'
import { format, parse } from 'date-fns'
import { formatDate, formatFirstLastName } from '../../../../utils/utils'
import validateForm from './lastDayValidation'
import { auditPageView } from '../../../../utils/auditUtils'
import { Page, SubjectType } from '../../../../services/auditService'

export default class LastDayHandler {
  GET = async (req: Request, res: Response) => {
    if (!req.session.registerJourney?.startDate) return res.redirect('start-date')
    if (req.session.registerJourney.endDateSelection !== 'yes') return res.redirect('end-date')
    const { prisoner } = req.session.registerJourney
    const { prisonerNumber } = prisoner
    req.session.registerJourney.returnTo = 'last-day'

    await auditPageView(req, Page.SET_END_DATE, {}, SubjectType.PRISONER_ID, null, prisonerNumber)

    return res.render('pages/register/last-day', {
      prisonerName: formatFirstLastName(prisoner.firstName, prisoner.lastName),
      prisoner,
      selectedDate: req.session.registerJourney.endDate
        ? formatDate(req.session.registerJourney.endDate, 'dd/MM/yyyy')
        : undefined,
    })
  }

  POST = async (req: Request, res: Response) => {
    if (!req.session.registerJourney?.startDate) return res.redirect('start-date')
    if (req.session.registerJourney.endDateSelection !== 'yes') return res.redirect('end-date')
    const { prisoner } = req.session.registerJourney
    const { selectedDate } = req.body

    const errors = validateForm(selectedDate, req.session.registerJourney.startDate)
    if (errors)
      return res.render('pages/register/last-day', {
        errors: [errors],
        selectedDate: selectedDate || '',
        prisonerName: formatFirstLastName(prisoner.firstName, prisoner.lastName),
        prisoner,
      })

    req.session.registerJourney.endDate = format(parse(selectedDate, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd')
    return res.redirect('check')
  }
}
