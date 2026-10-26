import { isBefore, isValid, parse, parseISO, startOfDay } from 'date-fns'
import { FormError } from '../../../../@types/template'
import { LastDayDefinition } from '../../../../statuses/types'

export interface LastDayForm {
  selectedDate?: string
}

type LastDayValidationResult = { valid: true; date: Date } | { valid: false; errors: FormError[] }

const invalid = (text: string): LastDayValidationResult => ({
  valid: false,
  errors: [{ href: '#selectedDate', text }],
})

export default function validateLastDay(
  form: LastDayForm,
  definition: LastDayDefinition,
  context: { startDate: string; today: Date },
): LastDayValidationResult {
  const { errors, rules } = definition
  const today = startOfDay(context.today)
  if (!form.selectedDate) return invalid(errors.missingDate)
  const date = parse(form.selectedDate, 'dd/MM/yyyy', today)
  if (!isValid(date)) return invalid(errors.invalidDate)
  if (isBefore(date, parseISO(context.startDate))) return invalid(errors.beforeStartDate)
  if (!rules.allowPastDates && isBefore(date, today)) return invalid(errors.pastDate)
  return { valid: true, date }
}
