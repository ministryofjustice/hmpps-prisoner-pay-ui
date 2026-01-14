import { Request, Response } from 'express'
import AuditService, { Action, Page, SubjectType } from '../../../services/auditService'

export default class ConfirmedAddPrisonerHandler {
  constructor(private readonly auditService: AuditService) {}

  GET = async (req: Request, res: Response) => {
    const { username } = res.locals.user
    const prisoner = req.session!.selectedPrisoner
    const { selectedDate } = req.session!

    await this.auditService.logPageView(Page.CONFIRM, {
      what: Action.VIEW_CONFIRM_PAY_STATUS_PERIOD,
      who: username,
      subjectType: SubjectType.NOT_APPLICABLE,
      details: {
        prisonerNumber: prisoner.prisonerNumber,
      },
    })

    return res.render('pages/register/confirmed-add-prisoner', {
      prisoner,
      selectedDate,
    })
  }
}
