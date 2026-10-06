import { Request, Response } from 'express'
import { addDays, format, parseISO, startOfToday } from 'date-fns'
import { formatFirstLastName } from '../../../../utils/utils'
import { auditPageView } from '../../../../utils/auditUtils'
import { Page, SubjectType } from '../../../../services/auditService'
import { FormError } from '../../../../@types/template'
import validateForm, { parseStartDate, StartDateForm } from './startDateValidation'
import { StartDateOption } from '../../journey'

export default class StartDateHandler {
  private render = (req: Request, res: Response, form: StartDateForm, errors: FormError[] = []) => {
    const { prisoner } = req.session.registerJourney
    return res.render('pages/register/start-date', {
      prisonerName: formatFirstLastName(prisoner.firstName, prisoner.lastName),
      today: format(startOfToday(), 'd MMMM yyyy'),
      tomorrow: format(addDays(startOfToday(), 1), 'd MMMM yyyy'),
      searchQuery: req.session.registerJourney.searchQuery,
      ...form,
      errors,
    })
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
    const date = startDate ? parseISO(startDate) : null
    return this.render(req, res, {
      startDateOption,
      startDate: date ? format(date, 'dd/MM/yyyy') : '',
    })
  }

  POST = async (req: Request, res: Response) => {
    if (!req.session.registerJourney?.prisoner) return res.redirect('add-prisoner')
    req.session.registerJourney.returnTo = 'start-date'
    const form: StartDateForm = {
      startDateOption: req.body.startDateOption,
      startDate: req.body.startDate,
    }
    const error = validateForm(form)
    if (error) return this.render(req, res, form, [error])
    const date =
      form.startDateOption === 'other'
        ? parseStartDate(form)
        : addDays(startOfToday(), form.startDateOption === 'tomorrow' ? 1 : 0)
    req.session.registerJourney.startDate = format(date, 'yyyy-MM-dd')
    req.session.registerJourney.startDateOption = form.startDateOption as StartDateOption
    return res.redirect('end-date')
  }
}
