import { Request, Response } from 'express'
import { FormError } from '../../../../@types/template'
import { findError, formatFirstLastName } from '../../../../utils/utils'
import validateForm from './cancelValidation'

export default class CancelHandler {
  private render = (req: Request, res: Response, choice?: string, errors: FormError[] = []) => {
    const { prisoner } = req.session.registerJourney
    const prisonerName = formatFirstLastName(prisoner.firstName, prisoner.lastName)
    return res.render('pages/register/cancel', {
      prisonerName,
      choice,
      errors,
      radios: {
        name: 'choice',
        classes: 'govuk-radios--inline',
        legend: `Are you sure you want to cancel adding ${prisonerName}?`,
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
    if (!req.session.registerJourney) return res.redirect('add-prisoner')
    return this.render(req, res)
  }

  POST = async (req: Request, res: Response) => {
    const journey = req.session.registerJourney
    if (!journey) return res.redirect('add-prisoner')
    const { choice } = req.body
    const { payTypeSlug } = req.params

    const errors = validateForm(choice)
    if (errors) return this.render(req, res, choice, [errors])

    if (choice === 'yes') {
      delete req.session.registerJourney
      return res.redirect(`/${payTypeSlug}/pay-overview`)
    }
    return res.redirect(journey.returnTo || 'add-prisoner')
  }
}
