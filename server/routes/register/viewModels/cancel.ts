import { FormError } from '../../../@types/template'
import { StatusDefinition } from '../../../statuses/types'
import { findError, formatFirstLastName } from '../../../utils/utils'
import { RegisterJourney } from '../journey'
import { CancellationForm } from '../handlers/cancel/cancelValidation'

export default function buildCancellationPage(
  status: StatusDefinition,
  context: { journey: RegisterJourney; form: CancellationForm; errors: FormError[] },
) {
  const { journey, form, errors } = context
  const content = status.cancellation
  const prisonerName = formatFirstLastName(journey.prisoner.firstName, journey.prisoner.lastName)

  return {
    pageTitleSuffix: content.pageTitle,
    confirmButtonText: content.confirmButtonText,
    ...form,
    errors,
    radios: {
      name: 'choice',
      classes: 'govuk-radios--inline',
      legend: content.question({ prisonerName }),
      value: form.choice,
      errorMessage: findError(errors, 'choice'),
      items: content.options.map(value => ({ value, text: content.optionLabels[value] })),
    },
  }
}
