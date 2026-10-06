import { Request, Response } from 'express'
import { formatFirstLastName } from '../../../../utils/utils'
import validateForm from './cancelValidation'

export default class CancelHandler {
  GET = async (req: Request, res: Response) => {
    const journey = req.session.registerJourney
    if (!journey) return res.redirect('add-prisoner')
    return res.render('pages/register/cancel', {
      prisonerName: formatFirstLastName(journey.prisoner.firstName, journey.prisoner.lastName),
    })
  }

  POST = async (req: Request, res: Response) => {
    const journey = req.session.registerJourney
    if (!journey) return res.redirect('add-prisoner')
    const { choice } = req.body
    const { payTypeSlug } = req.params

    const errors = validateForm(choice)
    if (errors)
      return res.render('pages/register/cancel', {
        errors: [errors],
        choice,
        prisonerName: formatFirstLastName(journey.prisoner.firstName, journey.prisoner.lastName),
      })

    if (choice === 'yes') {
      delete req.session.registerJourney
      return res.redirect(`/${payTypeSlug}/pay-overview`)
    }
    return res.redirect(journey.returnTo || 'add-prisoner')
  }
}
