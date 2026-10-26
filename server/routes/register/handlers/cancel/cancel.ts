import { Request, Response } from 'express'
import { FormError } from '../../../../@types/template'
import getStatusDefinition from '../../../../statuses'
import buildCancellationPage from '../../viewModels/cancel'
import validateCancellation, { CancellationForm } from './cancelValidation'

export default class CancelHandler {
  private render = (req: Request, res: Response, form: CancellationForm, errors: FormError[] = []) => {
    const status = getStatusDefinition(res.locals.payType.type)
    return res.render(
      'pages/register/cancel',
      buildCancellationPage(status, {
        journey: req.session.registerJourney,
        form,
        errors,
      }),
    )
  }

  GET = async (req: Request, res: Response) => {
    if (!req.session.registerJourney) return res.redirect('add-prisoner')
    return this.render(req, res, {})
  }

  POST = async (req: Request, res: Response) => {
    const journey = req.session.registerJourney
    if (!journey) return res.redirect('add-prisoner')
    const form: CancellationForm = { choice: req.body.choice }
    const { payTypeSlug } = req.params

    const status = getStatusDefinition(res.locals.payType.type)
    const result = validateCancellation(form, status.cancellation)
    if (result.valid === false) return this.render(req, res, form, result.errors)

    if (result.choice === 'yes') {
      delete req.session.registerJourney
      return res.redirect(`/${payTypeSlug}/pay-overview`)
    }
    return res.redirect(journey.returnTo || 'add-prisoner')
  }
}
