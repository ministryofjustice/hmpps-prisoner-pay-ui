import { Request, Response } from 'express'
import { FormError } from '../../../@types/template'
import { findError, formatFirstLastName } from '../../../utils/utils'
import validateForm from './cancelValidation'

export default class CancelHandler {
  private render = (req: Request, res: Response, choice?: string, errors: FormError[] = []) => {
    const { selectedPrisoner: prisoner } = req.session
    const prisonerName = formatFirstLastName(prisoner.firstName, prisoner.lastName)
    return res.render('pages/remove/cancel', {
      prisonerName,
      choice,
      errors,
      radios: {
        name: 'choice',
        classes: 'govuk-radios--inline',
        legend: `Are you sure you want to cancel removing ${prisonerName}?`,
        value: choice,
        errorMessage: findError(errors, 'choice'),
        items: [
          { value: 'yes', text: 'Yes' },
          { value: 'no', text: 'No' },
        ],
      },
    })
  }

  GET = async (req: Request, res: Response) => {
    return this.render(req, res)
  }

  POST = async (req: Request, res: Response) => {
    const { choice } = req.body
    const { payTypeSlug } = req.params

    const errors = validateForm(choice)
    if (errors) return this.render(req, res, choice, [errors])

    if (choice === `yes`) {
      req.session.selectedPrisoner = null
      req.session.returnTo = null
      return res.redirect(`/${payTypeSlug}/pay-overview`)
    }
    const { returnTo } = req.session
    return res.redirect(returnTo || '/')
  }
}
