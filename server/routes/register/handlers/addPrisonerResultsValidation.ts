import { FormError } from '../../../@types/template'

type AddPrisonerResultsForm = {
  selectedPrisoner: string
}

const errors: { [key: string]: FormError } = {
  NONE_SELECTED: {
    href: '#selectedPrisoner',
    text: 'You must select someone',
  },
  NOT_IN_RESULTS: {
    href: '#selectedPrisoner',
    text: 'Select someone from the current search results',
  },
}

export default function validateForm(
  { selectedPrisoner }: AddPrisonerResultsForm,
  prisonerResults: { prisonerNumber: string }[],
): FormError | null {
  if (!selectedPrisoner) return errors.NONE_SELECTED
  if (!prisonerResults.some(prisoner => prisoner.prisonerNumber === selectedPrisoner)) return errors.NOT_IN_RESULTS

  return null
}
