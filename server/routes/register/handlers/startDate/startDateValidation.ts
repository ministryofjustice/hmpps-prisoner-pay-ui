import { addDays, isValid, parse, startOfDay } from 'date-fns'
import { FormError } from '../../../../@types/template'
import { StartDateDefinition, StartDateOption } from '../../../../statuses/types'

export type StartDateForm = {
  startDateOption?: string
  startDate?: string
}

type StartDateValidationResult =
  { valid: true; date: Date; option: StartDateOption } | { valid: false; errors: FormError[] }

const invalid = (field: string, text: string): StartDateValidationResult => ({
  valid: false,
  errors: [{ href: `#${field}`, text }],
})

export default function validateStartDate(
  form: StartDateForm,
  definition: StartDateDefinition,
  context: { today: Date },
): StartDateValidationResult {
  const { errors, rules } = definition
  const today = startOfDay(context.today)
  const option = definition.options.find(value => value === form.startDateOption)
  if (!option) return invalid('startDateOption', errors.missingOption)

  if (option !== 'other') {
    return { valid: true, option, date: addDays(today, option === 'tomorrow' ? 1 : 0) }
  }

  if (!form.startDate?.trim()) return invalid('startDate', errors.missingDate)

  const date = parse(form.startDate, 'dd/MM/yyyy', today)
  if (!isValid(date)) return invalid('startDate', errors.invalidDate)
  if (!rules.allowPastDates && date < today) return invalid('startDate', errors.pastDate)

  return { valid: true, option, date }
}
