import { FormError } from '../../../@types/template'
import { StatusDefinition } from '../../../statuses/types'
import { findError, formatFirstLastName } from '../../../utils/utils'
import { RegisterJourney } from '../journey'
import { LastDayForm } from '../handlers/endDate/lastDayValidation'

export default function buildLastDayPage(
  status: StatusDefinition,
  context: { journey: RegisterJourney; form: LastDayForm; errors: FormError[] },
) {
  const { journey, form, errors } = context
  const content = status.lastDay
  const prisonerName = formatFirstLastName(journey.prisoner.firstName, journey.prisoner.lastName)

  return {
    ...form,
    errors,
    datePicker: {
      id: 'selectedDate',
      name: 'selectedDate',
      leadingZeros: 'true',
      classes: 'moj-datepicker--fixed-width',
      label: {
        text: content.question({ prisonerName }),
        isPageHeading: true,
        classes: 'govuk-label--l',
      },
      hint: { text: content.hint },
      value: form.selectedDate,
      errorMessage: findError(errors, 'selectedDate'),
    },
  }
}
