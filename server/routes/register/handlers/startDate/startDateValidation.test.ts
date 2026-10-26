import { format } from 'date-fns'
import validateStartDate, { StartDateForm } from './startDateValidation'
import longTermSick from '../../../../statuses/longTermSick'
import { StartDateDefinition } from '../../../../statuses/types'

const today = new Date('2026-01-07T12:00:00Z')
const validate = (form: StartDateForm, definition = longTermSick.startDate) =>
  validateStartDate(form, definition, { today })

describe('start date validation', () => {
  it.each([
    ['today', '2026-01-07'],
    ['tomorrow', '2026-01-08'],
  ])('resolves %s without validating unused custom input', (startDateOption, expected) => {
    const result = validate({ startDateOption, startDate: 'invalid' })
    expect(result.valid).toBe(true)
    if (result.valid === true) expect(format(result.date, 'yyyy-MM-dd')).toBe(expected)
  })

  it.each([undefined, '', 'invalid'])('rejects invalid option %s', startDateOption => {
    expect(validate({ startDateOption })).toEqual({
      valid: false,
      errors: [{ href: '#startDateOption', text: 'Select when this status should start' }],
    })
  })

  it.each([
    ['', 'Enter or select a start date'],
    ['31/02/2026', 'Enter a real start date'],
    ['29/02/2027', 'Enter a real start date'],
    ['abc', 'Enter a real start date'],
    ['06/01/2026', 'The start date must be today or in the future'],
  ])('validates %s', (startDate, text) => {
    expect(validate({ startDateOption: 'other', startDate })).toEqual({
      valid: false,
      errors: [{ href: '#startDate', text }],
    })
  })

  it.each(['07/01/2026', '08/01/2026', '20/01/2026', '29/02/2028'])(
    'accepts today, tomorrow or a future date: %s',
    startDate => {
      const result = validate({ startDateOption: 'other', startDate })
      expect(result.valid).toBe(true)
      if (result.valid === true) expect(format(result.date, 'dd/MM/yyyy')).toBe(startDate)
    },
  )

  it('rejects a known option when the status does not offer it, using its configured error', () => {
    const definition: StartDateDefinition = {
      ...longTermSick.startDate,
      options: ['other'],
      errors: { ...longTermSick.startDate.errors, missingOption: 'Choose a specific date' },
    }
    expect(validate({ startDateOption: 'today' }, definition)).toEqual({
      valid: false,
      errors: [{ href: '#startDateOption', text: 'Choose a specific date' }],
    })
  })

  it('allows past dates only when the definition permits them', () => {
    const form = { startDateOption: 'other', startDate: '06/01/2026' }
    expect(validate(form).valid).toBe(false)
    expect(validate(form, { ...longTermSick.startDate, rules: { allowPastDates: true } }).valid).toBe(true)
  })

  it.each([
    ['', 'Missing example date'],
    ['invalid', 'Invalid example date'],
    ['06/01/2026', 'Example date is too early'],
  ])('uses configured date errors for %s', (startDate, text) => {
    const definition: StartDateDefinition = {
      ...longTermSick.startDate,
      errors: {
        missingOption: 'Choose an option',
        missingDate: 'Missing example date',
        invalidDate: 'Invalid example date',
        pastDate: 'Example date is too early',
      },
    }
    expect(validate({ startDateOption: 'other', startDate }, definition)).toEqual({
      valid: false,
      errors: [{ href: '#startDate', text }],
    })
  })
})
