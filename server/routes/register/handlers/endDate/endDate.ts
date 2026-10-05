import { Request, Response } from 'express'
import { format, parse } from 'date-fns'
import { formatDate, formatFirstLastName } from '../../../../utils/utils'
import validateForm from './endDateValidation'
import { auditPageView } from '../../../../utils/auditUtils'
import { Page, SubjectType } from '../../../../services/auditService'
import { EndDateSelection } from '../../journey'

export default class EndDateHandler {
  GET = async (req: Request, res: Response) => {
    if (!req.session.registerJourney?.startDate) return res.redirect('start-date')
    const { prisoner } = req.session.registerJourney
    const { prisonerNumber } = prisoner
    req.session.registerJourney.returnTo = 'end-date'

    await auditPageView(req, Page.SET_END_DATE, {}, SubjectType.PRISONER_ID, null, prisonerNumber)

    return res.render('pages/register/end-date', {
      prisonerName: formatFirstLastName(prisoner.firstName, prisoner.lastName),
      prisoner,
      selectedDate: req.session.registerJourney.endDate
        ? formatDate(req.session.registerJourney.endDate, 'dd/MM/yyyy')
        : undefined,
      endDateSelection: req.session.registerJourney.endDateSelection,
    })
  }

  POST = async (req: Request, res: Response) => {
    if (!req.session.registerJourney?.startDate) return res.redirect('start-date')
    const { prisoner } = req.session.registerJourney
    const { selectedDate, endDateSelection } = req.body

    const errors = validateForm(endDateSelection, selectedDate, req.session.registerJourney.startDate)
    if (errors)
      return res.render('pages/register/end-date', {
        errors: [errors],
        endDateSelection,
        selectedDate: selectedDate || '',
        prisonerName: formatFirstLastName(prisoner.firstName, prisoner.lastName),
        prisoner,
      })

    req.session.registerJourney.endDate =
      endDateSelection === 'yes' ? format(parse(selectedDate, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd') : undefined
    req.session.registerJourney.endDateSelection = endDateSelection as EndDateSelection
    return res.redirect('check')
  }
}
