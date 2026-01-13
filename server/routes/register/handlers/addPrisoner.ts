import { Request, Response } from 'express'
import validateForm from './addPrisonerValidation'
import AuditService, { Action, Page, SubjectType } from '../../../services/auditService'

export default class AddPrisonerHandler {
  constructor(private readonly auditService: AuditService) {}

  GET = async (req: Request, res: Response) => {
    return res.render('pages/register/add-prisoner', {})
  }

  POST = async (req: Request, res: Response) => {
    const { username } = res.locals.user
    const { query } = req.body

    await this.auditService.logPageView(Page.ADD_PRISONER, {
      who: username,
      what: Action.SEARCH_PRISONER,
      subjectId: req.body,
      subjectType: SubjectType.SEARCH_TERM,
    })

    const errors = validateForm({ query })
    if (errors) return res.render('pages/register/add-prisoner', { errors: [errors], query })

    return res.redirect(`./add-prisoner-results?query=${encodeURIComponent(query)}`)
  }
}
