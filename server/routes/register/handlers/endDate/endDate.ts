import { Request, Response } from 'express'
import { FormError } from '../../../../@types/template'
import { findError, formatFirstLastName } from '../../../../utils/utils'
import { auditPageView } from '../../../../utils/auditUtils'
import { Page, SubjectType } from '../../../../services/auditService'
import { EndDateSelection } from '../../journey'
import validateForm from './endDateValidation'

export default class EndDateHandler {
  private render = (req: Request, res: Response, endDateSelection?: string, errors: FormError[] = []) => {
    const { prisoner } = req.session.registerJourney
    const prisonerName = formatFirstLastName(prisoner.firstName, prisoner.lastName)
    return res.render('pages/register/end-date', {
      prisoner,
      prisonerName,
      endDateSelection,
      errors,
      radios: {
        name: 'endDateSelection',
        classes: 'govuk-radios',
        legend: `Do you want to set how long ${prisonerName} is off sick for?`,
        value: endDateSelection,
        errorMessage: findError(errors, 'endDateSelection'),
        items: [
          { value: 'yes', text: 'Yes' },
          { value: 'no', text: 'No' },
        ],
      },
    })
  }

  GET = async (req: Request, res: Response) => {
    if (!req.session.registerJourney?.startDate) return res.redirect('start-date')
    const { prisoner } = req.session.registerJourney
    const { prisonerNumber } = prisoner
    req.session.registerJourney.returnTo = 'end-date'

    await auditPageView(req, Page.SET_END_DATE_SELECTION, {}, SubjectType.PRISONER_ID, null, prisonerNumber)

    return this.render(req, res, req.session.registerJourney.endDateSelection)
  }

  POST = async (req: Request, res: Response) => {
    if (!req.session.registerJourney?.startDate) return res.redirect('start-date')
    const { endDateSelection } = req.body

    const errors = validateForm(endDateSelection)
    if (errors) return this.render(req, res, endDateSelection, [errors])

    if (endDateSelection === 'no') req.session.registerJourney.endDate = undefined
    req.session.registerJourney.endDateSelection = endDateSelection as EndDateSelection
    return res.redirect(endDateSelection === 'yes' ? 'last-day' : 'check')
  }
}
