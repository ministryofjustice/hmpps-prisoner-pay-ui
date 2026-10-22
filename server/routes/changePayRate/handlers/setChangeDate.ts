import { addDays, format } from 'date-fns'
import { Request, Response } from 'express'
import { FormError } from '../../../@types/template'
import { findError } from '../../../utils/utils'
import validateForm from './setChangeDateValidation'

export default class SetChangeDateHandler {
  private render = (res: Response, changeDateOption?: string, changeDate?: string, errors: FormError[] = []) => {
    const tomorrow = addDays(new Date(), 1)
    return res.render('pages/changePayRate/set-change-date', {
      tomorrow,
      changeDateOption,
      changeDate,
      errors,
      radios: {
        name: 'changeDateOption',
        classes: 'govuk-radios',
        legend: 'When do you want the change to take effect?',
        value: changeDateOption,
        errorMessage: findError(errors, 'changeDateOption'),
        items: [
          { value: 'tomorrow', text: `Tomorrow - ${format(tomorrow, 'EEEE, d MMMM yyyy')}` },
          {
            value: 'other',
            text: 'On another date',
            datePicker: {
              id: 'changeDate',
              name: 'changeDate',
              label: { text: 'Input the removal date', classes: 'govuk-visually-hidden' },
              value: changeDate,
              errorMessage: findError(errors, 'changeDate'),
            },
          },
        ],
      },
    })
  }

  GET = async (req: Request, res: Response) => this.render(res)

  POST = async (req: Request, res: Response) => {
    const { changeDateOption, changeDate } = req.body

    const errors = validateForm({ changeDateOption, changeDate })

    if (errors) return this.render(res, changeDateOption, changeDate, [errors])

    req.session!.selectedDate =
      changeDateOption === 'tomorrow' ? format(addDays(new Date(), 1), 'dd/MM/yyyy') : changeDate
    return res.redirect('./check-pay-rate')
  }
}
