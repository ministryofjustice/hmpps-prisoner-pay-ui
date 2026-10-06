import { FormError } from '../../../../@types/template'

const errors: { [key: string]: FormError } = {
  SELECT_OPTION: {
    href: '#endDateSelection',
    text: 'Select if you want to set their last day or not',
  },
}

export default function validateForm(endDateSelection: string): FormError | null {
  if (!['yes', 'no'].includes(endDateSelection)) return errors.SELECT_OPTION

  return null
}
