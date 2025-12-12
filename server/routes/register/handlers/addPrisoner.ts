import { Request, Response } from 'express'
import validateForm from './addPrisonerValidation'

export default class AddPrisonerHandler {
  constructor() {}

  GET = async (req: Request, res: Response) => {
    return res.render('pages/register/add-prisoner', {})
  }

  POST = async (req: Request, res: Response) => {
    const { query } = req.body

    const errors = validateForm({ query })
    if (errors) return res.render('pages/register/add-prisoner', { errors: [errors], query })

    return res.redirect('')
  }
}
