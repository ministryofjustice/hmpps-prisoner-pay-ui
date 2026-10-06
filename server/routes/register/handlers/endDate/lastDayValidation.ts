import { isBefore, isValid, parse, parseISO, startOfToday } from 'date-fns'
import { FormError } from '../../../../@types/template'

const errors: { [key: string]: FormError } = {
  ENTER_DATE: {
    href: '#selectedDate',
    text: 'Enter or select a date',
  },
  VALID_DATE: {
    href: '#selectedDate',
    text: 'Enter a real date',
  },
  PAST_DATE: {
    href: '#selectedDate',
    text: 'The end date cannot be in the past',
  },
  FUTURE_DATE: {
    href: '#selectedDate',
    text: 'The end date must be on or after the start date',
  },
}

export default function validateForm(selectedDate: string, startDate: string): FormError | null {
  if (!selectedDate) return errors.ENTER_DATE
  const parsedDate = parse(selectedDate, 'dd/MM/yyyy', new Date())
  if (!isValid(parsedDate)) return errors.VALID_DATE
  if (isBefore(parsedDate, parseISO(startDate))) return errors.FUTURE_DATE
  if (isBefore(parsedDate, startOfToday())) return errors.PAST_DATE
  return null
}
