import { addDays, format, startOfDay } from 'date-fns'
import { FormError } from '../../../@types/template'
import { StatusDefinition } from '../../../statuses/types'
import { findError, formatFirstLastName } from '../../../utils/utils'
import { RegisterJourney } from '../journey'
import { StartDateForm } from '../handlers/startDate/startDateValidation'

interface StartDatePageContext {
  journey: RegisterJourney
  form: StartDateForm
  errors: FormError[]
  today: Date
}

export default function buildStartDatePage(status: StatusDefinition, context: StartDatePageContext) {
  const { journey, form, errors, today } = context
  const content = status.startDate
  const prisonerName = formatFirstLastName(journey.prisoner.firstName, journey.prisoner.lastName)

  const items = content.options.map(value => {
    if (value === 'other') {
      return {
        value,
        text: content.optionLabels.other,
        datePicker: {
          id: 'startDate',
          name: 'startDate',
          label: { text: content.dateInput.label },
          hint: { text: content.dateInput.hint },
          errorMessage: findError(errors, 'startDate'),
          value: form.startDate,
        },
      }
    }

    const date = addDays(startOfDay(today), value === 'tomorrow' ? 1 : 0)
    return { value, text: `${content.optionLabels[value]} - ${format(date, 'd MMMM yyyy')}` }
  })

  return {
    searchQuery: journey.searchQuery,
    ...form,
    errors,
    radios: {
      name: 'startDateOption',
      legend: content.question({ prisonerName }),
      value: form.startDateOption,
      errorMessage: findError(errors, 'startDateOption'),
      items,
    },
  }
}
