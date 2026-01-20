import { Request, Response } from 'express'
import { auditPageView } from '../../../utils/auditUtils'
import { Page, SubjectType } from '../../../services/auditService'

export default class ConfirmedAddPrisonerHandler {
  constructor() {}

  GET = async (req: Request, res: Response) => {
    const { selectedPrisoner: prisoner, selectedDate } = req.session!
    const { prisonerNumber } = prisoner

    await auditPageView(req, Page.CONFIRMED_ADD_DATE, {}, SubjectType.PRISONER_ID, null, prisonerNumber)

    return res.render('pages/register/confirmed-add-prisoner', {
      prisoner,
      selectedDate,
    })
  }
}
