import { FormError } from '../../../../@types/template'
import { CancellationChoice, CancellationDefinition } from '../../../../statuses/types'

export interface CancellationForm {
  choice?: string
}

type CancellationValidationResult = { valid: true; choice: CancellationChoice } | { valid: false; errors: FormError[] }

export default function validateCancellation(
  form: CancellationForm,
  definition: CancellationDefinition,
): CancellationValidationResult {
  const choice = definition.options.find(value => value === form.choice)
  if (!choice) {
    return { valid: false, errors: [{ href: '#choice', text: definition.errors.missingOption }] }
  }
  return { valid: true, choice }
}
