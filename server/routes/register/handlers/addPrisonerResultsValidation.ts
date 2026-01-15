import { FormError } from '../../../@types/template'

type AddPrisonerResultsForm = {
  selectedPrisoner: string
}

const errors: { [key: string]: FormError } = {
  NONE_SELECTED: {
    href: '#selectedPrisoner',
    text: 'You must select someone',
  },
}

// TODO: Error is missing selector

export default function validateForm({ selectedPrisoner }: AddPrisonerResultsForm): FormError | null {
  if (!selectedPrisoner) return errors.NONE_SELECTED

  return null
}
