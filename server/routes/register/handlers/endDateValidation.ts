import { isBefore, isValid, parse } from 'date-fns'
import { FormError } from '../../../@types/template'

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
    text: 'The date must be after today',
  },
}

export default function validateForm(endDateSelection: string, selectedDate: string): FormError | null {
  if (!endDateSelection) return errors.SELECT_OPTION

  if (endDateSelection === 'yes' && !selectedDate) return errors.ENTER_DATE

  const parsedDate = parse(selectedDate, 'dd/MM/yyyy', new Date())

  if (endDateSelection === 'yes' && !isValid(parsedDate)) return errors.VALID_DATE

  if (endDateSelection === 'yes' && isValid(parsedDate) && isBefore(parsedDate, new Date())) return errors.FUTURE_DATE

  return null
}
