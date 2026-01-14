import { FormError } from '../../../@types/template'

type AddPrisonerResultsForm = {
  selectedPrisoner: string
}

const errors: { [key: string]: FormError } = {
  NONE_SELECTED: {
    href: '#selectedPrisoner',
    text: 'Select a prisoner to add',
  },
}

// TODO: Error is missing selector

export default function validateForm({ selectedPrisoner }: AddPrisonerResultsForm): FormError | null {
  if (!selectedPrisoner) return errors.NONE_SELECTED

  return null
}
