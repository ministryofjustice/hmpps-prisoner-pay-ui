import { isBefore, isValid, parse, parseISO } from 'date-fns'
import { FormError } from '../../../../@types/template'

const errors: { [key: string]: FormError } = {
  SELECT_OPTION: {
    href: '#endDateSelection',
    text: 'Select end date option',
  },
  ENTER_DATE: {
    href: '#selectedDate',
    text: 'Enter or select a date',
  },
  VALID_DATE: {
    href: '#selectedDate',
    text: 'Enter a real date',
  },
  FUTURE_DATE: {
    href: '#selectedDate',
    text: 'The end date must be on or after the start date',
  },
}

export default function validateForm(
  endDateSelection: string,
  selectedDate: string,
  startDate: string,
): FormError | null {
  if (!['yes', 'no'].includes(endDateSelection)) return errors.SELECT_OPTION

  if (endDateSelection === 'no') return null

  if (endDateSelection === 'yes' && !selectedDate) return errors.ENTER_DATE

  const parsedDate = parse(selectedDate, 'dd/MM/yyyy', new Date())

  if (endDateSelection === 'yes' && !isValid(parsedDate)) return errors.VALID_DATE

  if (endDateSelection === 'yes' && isValid(parsedDate) && isBefore(parsedDate, parseISO(startDate)))
    return errors.FUTURE_DATE

  return null
}
