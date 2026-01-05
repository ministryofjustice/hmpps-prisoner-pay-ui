import { FormError } from '../../../@types/template'

type RemovalDateForm = {
  removalDateOption: string
  removalDate?: string
}

const errors: { [key: string]: FormError } = {
  MISSING_REMOVAL_DATE_OPTION: {
    href: '#removalDateOption',
    text: 'Select a removal date option',
  },
  MISSING_REMOVAL_DATE: {
    href: '#removalDate',
    text: 'Enter a removal date',
  },
}

export default function validateForm({ removalDateOption, removalDate }: RemovalDateForm): FormError | null {
  if (!removalDateOption) return errors.MISSING_REMOVAL_DATE_OPTION

  if (removalDateOption === 'other' && !removalDate) return errors.MISSING_REMOVAL_DATE

  return null
}
