import { FormError } from '../../../../@types/template'
import { EndDateDefinition, EndDateSelection } from '../../../../statuses/types'

export interface EndDateForm {
  endDateSelection?: string
}

type EndDateValidationResult = { valid: true; selection: EndDateSelection } | { valid: false; errors: FormError[] }

export default function validateEndDate(form: EndDateForm, definition: EndDateDefinition): EndDateValidationResult {
  const selection = definition.options.find(value => value === form.endDateSelection)
  if (!selection) {
    return { valid: false, errors: [{ href: '#endDateSelection', text: definition.errors.missingOption }] }
  }
  return { valid: true, selection }
}
