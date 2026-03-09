import { FormError } from '../../../@types/template'

type SetChangeDateForm = {
  changeDateOption: string
  changeDate?: string
}

// TODO: Validation is missing check to ensure the date is in the future and is valid (up to 30 days).

const errors: { [key: string]: FormError } = {
  MISSING_CHANGE_DATE_OPTION: {
    href: '#changeDateOption',
    text: 'Select when you want the change to take effect',
  },
  MISSING_CHANGE_DATE: {
    href: '#changeDate',
    text: 'Enter a change date',
  },
}

export default function validateForm({ changeDateOption, changeDate }: SetChangeDateForm): FormError | null {
  if (!changeDateOption) return errors.MISSING_CHANGE_DATE_OPTION

  if (changeDateOption === 'other' && !changeDate) return errors.MISSING_CHANGE_DATE

  return null
}
