import { isValid, parse, startOfToday } from 'date-fns'
import { FormError } from '../../../@types/template'

export type StartDateForm = {
  startDateOption?: string
  startDate?: string
}

export const parseStartDate = ({ startDate }: StartDateForm): Date => parse(startDate || '', 'dd/MM/yyyy', new Date())

export default function validateForm(form: StartDateForm): FormError | null {
  if (!['today', 'tomorrow', 'other'].includes(form.startDateOption))
    return { href: '#startDateOption', text: 'Select when this status should start' }

  if (form.startDateOption !== 'other') return null

  if (!form.startDate?.trim()) return { href: '#startDate', text: 'Enter or select a start date' }

  const date = parseStartDate(form)

  if (!isValid(date)) return { href: '#startDate', text: 'Enter a real start date' }

  if (date < startOfToday()) return { href: '#startDate', text: 'The start date must be today or in the future' }

  return null
}
