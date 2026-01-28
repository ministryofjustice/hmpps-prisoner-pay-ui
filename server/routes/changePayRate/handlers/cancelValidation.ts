import { FormError } from '../../../@types/template'

const errors: { [key: string]: FormError } = {
  SELECT_OPTION: {
    href: '#choice',
    text: 'Select cancellation option',
  },
}

export default function validateForm(choice: string): FormError | null {
  if (!choice) return errors.SELECT_OPTION

  return null
}
