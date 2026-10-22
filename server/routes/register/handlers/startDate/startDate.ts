import { Request, Response } from 'express'
import { addDays, format, parseISO, startOfToday } from 'date-fns'
import { findError, formatFirstLastName } from '../../../../utils/utils'
import { auditPageView } from '../../../../utils/auditUtils'
import { Page, SubjectType } from '../../../../services/auditService'
import { FormError } from '../../../../@types/template'
import validateForm, { parseStartDate, StartDateForm } from './startDateValidation'
import { StartDateOption } from '../../journey'

export default class StartDateHandler {
  private render = (req: Request, res: Response, form: StartDateForm, errors: FormError[] = []) => {
    const { prisoner } = req.session.registerJourney
    const prisonerName = formatFirstLastName(prisoner.firstName, prisoner.lastName)
    return res.render('pages/register/start-date', {
      radios: {
        name: 'startDateOption',
        legend: `When is ${prisonerName}’s first day on ${res.locals.payType.description.toLowerCase()}?`,
        value: form.startDateOption,
        errorMessage: findError(errors, 'startDateOption'),
        items: [
          { value: 'today', text: `Today - ${format(startOfToday(), 'd MMMM yyyy')}` },
          { value: 'tomorrow', text: `Tomorrow - ${format(addDays(startOfToday(), 1), 'd MMMM yyyy')}` },
          {
            value: 'other',
            text: 'A different future date',
            datePicker: {
              id: 'startDate',
              name: 'startDate',
              label: { text: 'Enter or select the start date' },
              hint: { text: 'For example, 27/03/2027' },
              errorMessage: findError(errors, 'startDate'),
              value: form.startDate,
            },
          },
        ],
      },
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
    return this.render(req, res, {
      startDateOption,
      startDate: startDate ? format(parseISO(startDate), 'dd/MM/yyyy') : '',
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
