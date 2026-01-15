import { FormError } from '../../../@types/template'

type AddPrisonerForm = {
  query: string
}

const errors: { [key: string]: FormError } = {
  MISSING_QUERY: {
    href: '#query',
    text: 'You must enter a name or a prison number in the format A1234CD',
  },
}

export default function validateForm({ query }: AddPrisonerForm): FormError | null {
  if (!query) return errors.MISSING_QUERY

  return null
}
