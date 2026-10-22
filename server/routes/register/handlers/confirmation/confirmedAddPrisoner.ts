import { Request, Response } from 'express'
import { isToday, parseISO } from 'date-fns'
import config from '../../../../config'
import { formatDate, formatFirstLastName } from '../../../../utils/utils'
import { auditPageView } from '../../../../utils/auditUtils'
import { Page, SubjectType } from '../../../../services/auditService'

export default class ConfirmedAddPrisonerHandler {
  GET = async (req: Request, res: Response) => {
    if (!req.session.registerConfirmation) return res.redirect('add-prisoner')
    const { prisoner, startDate } = req.session.registerConfirmation
    const { prisonerNumber } = prisoner

    await auditPageView(req, Page.CONFIRMED_ADD_DATE, {}, SubjectType.PRISONER_ID, null, prisonerNumber)

    const prisonerName = formatFirstLastName(prisoner.firstName, prisoner.lastName)
    const startDateText = isToday(parseISO(startDate)) ? 'today' : formatDate(startDate, 'd MMMM yyyy')
    const { description } = res.locals.payType
    const allocationsUrl = `${config.activitiesUiUrl}/prisoner-allocations/${prisonerNumber}`

    return res.render('pages/register/confirmed-add-prisoner', {
      confirmation: {
        titleText: `${description} status confirmed`,
        text: `${prisonerName} (${prisonerNumber}) will receive ${description.toLowerCase()} pay from ${startDateText}`,
        nextSteps: [
          { text: `take ${prisonerName} off activities they’re allocated to`, href: allocationsUrl },
          { text: `manage ${prisonerName}’s allocations`, href: allocationsUrl },
          { text: `add someone else to ${description.toLowerCase()}`, href: '../register/new' },
        ],
      },
    })
  }
}
