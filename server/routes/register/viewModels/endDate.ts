import { FormError } from '../../../@types/template'
import { StatusDefinition } from '../../../statuses/types'
import { findError, formatFirstLastName } from '../../../utils/utils'
import { RegisterJourney } from '../journey'
import { EndDateForm } from '../handlers/endDate/endDateValidation'

export default function buildEndDatePage(
  status: StatusDefinition,
  context: { journey: RegisterJourney; form: EndDateForm; errors: FormError[] },
) {
  const { journey, form, errors } = context
  const content = status.endDate
  const prisonerName = formatFirstLastName(journey.prisoner.firstName, journey.prisoner.lastName)

  return {
    ...form,
    errors,
    radios: {
      name: 'endDateSelection',
      classes: 'govuk-radios',
      legend: content.question({ prisonerName }),
      value: form.endDateSelection,
      errorMessage: findError(errors, 'endDateSelection'),
      items: content.options.map(value => ({ value, text: content.optionLabels[value] })),
    },
  }
}
