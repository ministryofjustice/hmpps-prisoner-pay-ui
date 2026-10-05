import { Request, Response } from 'express'
import { isToday, parseISO } from 'date-fns'
import { formatDate, formatFirstLastName } from '../../../utils/utils'
import { auditPageView } from '../../../utils/auditUtils'
import { Page, SubjectType } from '../../../services/auditService'

export default class ConfirmedAddPrisonerHandler {
  constructor() {}

  GET = async (req: Request, res: Response) => {
    if (!req.session.registerConfirmation) return res.redirect('add-prisoner')
    const { prisoner, endDate: selectedDate, startDate } = req.session.registerConfirmation
    const { prisonerNumber } = prisoner

    await auditPageView(req, Page.CONFIRMED_ADD_DATE, {}, SubjectType.PRISONER_ID, null, prisonerNumber)

    return res.render('pages/register/confirmed-add-prisoner', {
      prisoner,
      selectedDate,
      startDate,
      prisonerName: formatFirstLastName(prisoner.firstName, prisoner.lastName),
      startDateText: isToday(parseISO(startDate)) ? 'today' : formatDate(startDate, 'd MMMM yyyy'),
    })
  }
}
