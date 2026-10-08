import { currencyFromPence, penceToPounds } from '../../../utils/currencyUtils'
import { FormError } from '../../../@types/template'

type PayAmountForm = {
  payAmount: string
}

const errors: { [key: string]: FormError } = {
  MISSING_PAY_AMOUNT: {
    href: '#payAmount',
    text: 'You must enter a pay amount',
  },
  INVALID_PAY_AMOUNT: {
    href: '#payAmount',
    text: 'Enter a valid pay amount',
  },
}

export default function validateForm(
  { payAmount }: PayAmountForm,
  minimumAmount: number,
  payTypeDescription: string,
): FormError | null {
  if (!payAmount?.trim()) return errors.MISSING_PAY_AMOUNT

  if (!/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(payAmount.trim()) || !Number.isFinite(Number(payAmount))) {
    return errors.INVALID_PAY_AMOUNT
  }

  const amount = Number(payAmount)

  if (amount <= 0 || amount < penceToPounds(minimumAmount)) {
    return {
      href: '#payAmount',
      text: `${payTypeDescription} pay cannot be less than ${currencyFromPence(minimumAmount)} per day`,
    }
  }

  return null
}
