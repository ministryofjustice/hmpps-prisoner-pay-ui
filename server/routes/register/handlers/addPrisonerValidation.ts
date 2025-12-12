import { FormError } from '../../../@types/template'

type AddPrisonerForm = {
  query: string
}

const errors: { [key: string]: FormError } = {
  MISSING_QUERY: {
    href: '#query',
    text: 'Enter a search query',
  },
}

export default function validateForm({ query }: AddPrisonerForm): FormError | null {
  if (!query) return errors.MISSING_QUERY

  return null
}
