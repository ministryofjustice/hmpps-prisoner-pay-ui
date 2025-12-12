import { FormError } from '../../../@types/template'

type AddPrisonerForm = {
  query: string
}

const errors: { [key: string]: FormError } = {
  MISSING_QUERY: {
    href: '#query',
    text: 'Input a query',
  },
}

export default function validateForm({ query }: AddPrisonerForm): FormError | null {
  if (!query) return errors.MISSING_QUERY

  return null
}
