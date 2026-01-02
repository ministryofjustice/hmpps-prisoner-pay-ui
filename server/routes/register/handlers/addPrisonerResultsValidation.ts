import { FormError } from '../../../@types/template'

type AddPrisonerResultsForm = {
  prisonerNumber: string
}

const errors: { [key: string]: FormError } = {
  NONE_SELECTED: {
    href: '#prisonerNumber',
    text: 'Select a prisoner to add',
  },
}

export default function validateForm({ prisonerNumber }: AddPrisonerResultsForm): FormError | null {
  if (!prisonerNumber) return errors.NONE_SELECTED

  return null
}
