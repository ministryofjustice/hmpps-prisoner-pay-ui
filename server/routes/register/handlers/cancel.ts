import { Request, Response } from 'express'
import { formatFirstLastName } from '../../../utils/utils'
import validateForm from './cancelValidation'

export default class CancelHandler {
  constructor() {}

  GET = async (req: Request, res: Response) => {
    const prisoner = req.session!.selectedPrisoner

    return res.render('pages/register/cancel', {
      prisonerName: formatFirstLastName(prisoner.firstName, prisoner.lastName),
    })
  }

  POST = async (req: Request, res: Response) => {
    const { choice } = req.body

    const errors = validateForm(choice)
    if (errors) return res.render('pages/register/cancel', { errors: [errors], choice })

    if (choice === `yes`) {
      req.session.selectedPrisoner = null
      req.session.returnTo = null
      return res.redirect('/')
    }
    const { returnTo } = req.session
    return res.redirect(returnTo || '/')
  }
}
