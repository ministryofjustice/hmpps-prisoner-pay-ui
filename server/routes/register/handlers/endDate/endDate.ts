import { Request, Response } from 'express'
import { formatFirstLastName } from '../../../../utils/utils'
import { auditPageView } from '../../../../utils/auditUtils'
import { Page, SubjectType } from '../../../../services/auditService'
import { EndDateSelection } from '../../journey'

export default class EndDateHandler {
  GET = async (req: Request, res: Response) => {
    if (!req.session.registerJourney?.startDate) return res.redirect('start-date')
    const { prisoner } = req.session.registerJourney
    const { prisonerNumber } = prisoner
    req.session.registerJourney.returnTo = 'end-date'

    await auditPageView(req, Page.SET_END_DATE_SELECTION, {}, SubjectType.PRISONER_ID, null, prisonerNumber)

    return res.render('pages/register/end-date', {
      prisonerName: formatFirstLastName(prisoner.firstName, prisoner.lastName),
      prisoner,
      endDateSelection: req.session.registerJourney.endDateSelection,
    })
  }

  POST = async (req: Request, res: Response) => {
    if (!req.session.registerJourney?.startDate) return res.redirect('start-date')
    const { prisoner } = req.session.registerJourney
    const { endDateSelection } = req.body

    if (!['yes', 'no'].includes(endDateSelection))
      return res.render('pages/register/end-date', {
        errors: [{ href: '#endDateSelection', text: 'Please select an option' }],
        endDateSelection,
        prisonerName: formatFirstLastName(prisoner.firstName, prisoner.lastName),
        prisoner,
      })

    if (endDateSelection === 'no') req.session.registerJourney.endDate = undefined
    req.session.registerJourney.endDateSelection = endDateSelection as EndDateSelection
    return res.redirect(endDateSelection === 'yes' ? 'last-day' : 'check')
  }
}
