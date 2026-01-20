import { Request, Response } from 'express'
import validateForm from './addPrisonerValidation'
import { Action, Page, SubjectType } from '../../../services/auditService'
import { auditPageAction } from '../../../utils/auditUtils'

export default class AddPrisonerHandler {
  GET = async (req: Request, res: Response) => {
    return res.render('pages/register/add-prisoner', {})
  }

  POST = async (req: Request, res: Response) => {
    const { query } = req.body

    await auditPageAction(req, Page.ADD_PRISONER, Action.SEARCH_PRISONER, { query }, SubjectType.SEARCH_TERM)

    const errors = validateForm({ query })
    if (errors) return res.render('pages/register/add-prisoner', { errors: [errors], query })

    return res.redirect(`./add-prisoner-results?query=${encodeURIComponent(query)}`)
  }
}
