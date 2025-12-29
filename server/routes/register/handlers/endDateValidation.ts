import { FormError } from '../../../@types/template'

const errors: { [key: string]: FormError } = {
  SELECT_OPTION: {
    href: '#endDateSelection',
    text: 'Select end date option',
  },
}

export default function validateForm(endDateSelection: string): FormError | null {
  if (!endDateSelection) return errors.SELECT_OPTION

  return null
}
