import { FormError } from '../../../@types/template'

type PayAmountForm = {
  payAmount: string
}

const errors: { [key: string]: FormError } = {
  MISSING_PAY_AMOUNT: {
    href: '#payAmount',
    text: 'You must enter a pay amount',
  },
}

export default function validateForm(
  { payAmount }: PayAmountForm,
  minimumAmount: number,
  payTypeDescription: string,
): FormError | null {
  if (!payAmount) return errors.MISSING_PAY_AMOUNT

  const amount = parseFloat(payAmount) * 100

  if (amount <= 0 || amount < minimumAmount) {
    return {
      href: '#payAmount',
      text: `${payTypeDescription} pay cannot be less than £${minimumAmount / 100} per day`,
    }
  }

  return null
}
