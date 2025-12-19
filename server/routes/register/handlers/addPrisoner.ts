import { Request, Response } from 'express'
import validateForm from './addPrisonerValidation'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'

export default class AddPrisonerHandler {
  constructor() {}

  GET = async (req: Request, res: Response) => {
    const payType = getPayTypeBySlug(req.params.payTypeSlug)
    return res.render('pages/register/add-prisoner', { payType })
  }

  POST = async (req: Request, res: Response) => {
    const { query } = req.body

    const errors = validateForm({ query })
    if (errors) return res.render('pages/register/add-prisoner', { errors: [errors], query })

    return res.redirect(`./add-prisoner-results?query=${encodeURIComponent(query)}`)
  }
}
