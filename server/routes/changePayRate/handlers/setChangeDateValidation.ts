import { isBefore, isValid, parse, startOfToday } from 'date-fns'
import { FormError } from '../../../@types/template'

type SetChangeDateForm = {
  changeDateOption: string
  changeDate?: string
}

const errors: { [key: string]: FormError } = {
  MISSING_CHANGE_DATE_OPTION: {
    href: '#changeDateOption',
    text: 'Select when you want the change to take effect',
  },
  MISSING_CHANGE_DATE: {
    href: '#changeDate',
    text: 'Enter a change date',
  },
  INVALID_CHANGE_DATE: {
    href: '#changeDate',
    text: 'Enter a real date',
  },
  PAST_CHANGE_DATE: {
    href: '#changeDate',
    text: 'The change date must be today or in the future',
  },
}

export default function validateForm({ changeDateOption, changeDate }: SetChangeDateForm): FormError | null {
  if (!changeDateOption) return errors.MISSING_CHANGE_DATE_OPTION

  if (changeDateOption === 'other') {
    if (!changeDate?.trim()) return errors.MISSING_CHANGE_DATE
    const parsedDate = parse(changeDate, 'dd/MM/yyyy', new Date())
    if (!isValid(parsedDate)) return errors.INVALID_CHANGE_DATE
    const today = startOfToday()
    if (isBefore(parsedDate, today)) return errors.PAST_CHANGE_DATE
  }

  return null
}
