import { Request, Response } from 'express'
import { startOfToday } from 'date-fns'
import config from '../../../../config'
import getStatusDefinition from '../../../../statuses'
import buildConfirmationPage from '../../viewModels/confirmation'
import { auditPageView } from '../../../../utils/auditUtils'
import { Page, SubjectType } from '../../../../services/auditService'

export default class ConfirmedAddPrisonerHandler {
  GET = async (req: Request, res: Response) => {
    if (!req.session.registerConfirmation) return res.redirect('add-prisoner')
    const { prisoner } = req.session.registerConfirmation
    const { prisonerNumber } = prisoner

    await auditPageView(req, Page.CONFIRMED_ADD_DATE, {}, SubjectType.PRISONER_ID, null, prisonerNumber)

    const status = getStatusDefinition(res.locals.payType.type)
    return res.render(
      'pages/register/confirmed-add-prisoner',
      buildConfirmationPage(status, {
        confirmation: req.session.registerConfirmation,
        today: startOfToday(),
        activitiesUiUrl: config.activitiesUiUrl,
      }),
    )
  }
}
