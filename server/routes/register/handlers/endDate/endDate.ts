import { Request, Response } from 'express'
import { FormError } from '../../../../@types/template'
import { auditPageView } from '../../../../utils/auditUtils'
import { Page, SubjectType } from '../../../../services/auditService'
import getStatusDefinition from '../../../../statuses'
import buildEndDatePage from '../../viewModels/endDate'
import validateEndDate, { EndDateForm } from './endDateValidation'

export default class EndDateHandler {
  private render = (req: Request, res: Response, form: EndDateForm, errors: FormError[] = []) => {
    const status = getStatusDefinition(res.locals.payType.type)
    return res.render(
      'pages/register/end-date',
      buildEndDatePage(status, {
        journey: req.session.registerJourney,
        form,
        errors,
      }),
    )
  }

  GET = async (req: Request, res: Response) => {
    if (!req.session.registerJourney?.startDate) return res.redirect('start-date')
    const { prisoner } = req.session.registerJourney
    const { prisonerNumber } = prisoner
    req.session.registerJourney.returnTo = 'end-date'

    await auditPageView(req, Page.SET_END_DATE_SELECTION, {}, SubjectType.PRISONER_ID, null, prisonerNumber)

    return this.render(req, res, { endDateSelection: req.session.registerJourney.endDateSelection })
  }

  POST = async (req: Request, res: Response) => {
    if (!req.session.registerJourney?.startDate) return res.redirect('start-date')
    const form: EndDateForm = { endDateSelection: req.body.endDateSelection }
    const status = getStatusDefinition(res.locals.payType.type)
    const result = validateEndDate(form, status.endDate)
    if (result.valid === false) return this.render(req, res, form, result.errors)

    if (result.selection === 'no') req.session.registerJourney.endDate = undefined
    req.session.registerJourney.endDateSelection = result.selection
    return res.redirect(result.selection === 'yes' ? 'last-day' : 'check')
  }
}
