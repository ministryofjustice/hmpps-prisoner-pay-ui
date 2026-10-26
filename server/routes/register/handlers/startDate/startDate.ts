import { Request, Response } from 'express'
import { format, parseISO, startOfToday } from 'date-fns'
import { auditPageView } from '../../../../utils/auditUtils'
import { Page, SubjectType } from '../../../../services/auditService'
import { FormError } from '../../../../@types/template'
import validateStartDate, { StartDateForm } from './startDateValidation'
import getStatusDefinition from '../../../../statuses'
import buildStartDatePage from '../../viewModels/startDate'

export default class StartDateHandler {
  private render = (
    req: Request,
    res: Response,
    context: { form: StartDateForm; errors?: FormError[]; today: Date },
  ) => {
    const status = getStatusDefinition(res.locals.payType.type)
    return res.render(
      'pages/register/start-date',
      buildStartDatePage(status, {
        journey: req.session.registerJourney,
        form: context.form,
        errors: context.errors || [],
        today: context.today,
      }),
    )
  }

  GET = async (req: Request, res: Response) => {
    if (!req.session.registerJourney?.prisoner) return res.redirect('add-prisoner')
    req.session.registerJourney.returnTo = 'start-date'
    await auditPageView(
      req,
      Page.SET_START_DATE,
      {},
      SubjectType.PRISONER_ID,
      null,
      req.session.registerJourney.prisoner.prisonerNumber,
    )
    const { startDate, startDateOption } = req.session.registerJourney
    return this.render(req, res, {
      form: { startDateOption, startDate: startDate ? format(parseISO(startDate), 'dd/MM/yyyy') : '' },
      today: startOfToday(),
    })
  }

  POST = async (req: Request, res: Response) => {
    if (!req.session.registerJourney?.prisoner) return res.redirect('add-prisoner')
    req.session.registerJourney.returnTo = 'start-date'
    const form: StartDateForm = {
      startDateOption: req.body.startDateOption,
      startDate: req.body.startDate,
    }
    const status = getStatusDefinition(res.locals.payType.type)
    const today = startOfToday()
    const result = validateStartDate(form, status.startDate, { today })
    if (result.valid === false) return this.render(req, res, { form, errors: result.errors, today })
    req.session.registerJourney.startDate = format(result.date, 'yyyy-MM-dd')
    req.session.registerJourney.startDateOption = result.option
    return res.redirect('end-date')
  }
}
