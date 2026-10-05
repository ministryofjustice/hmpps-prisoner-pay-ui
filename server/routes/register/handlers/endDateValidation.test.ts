import validateForm from './endDateValidation'

describe('endDateValidation', () => {
  it.each([
    ['no', '', null],
    ['no', undefined, null],
    ['no', 'invalid', null],
    ['yes', '20/01/2026', null],
    ['yes', '21/01/2026', null],
    ['', '', 'Select end date option'],
    ['invalid', '', 'Select end date option'],
    ['yes', '', 'Enter or select a date'],
    ['yes', '32/13/2026', 'Enter a real date'],
    ['yes', '19/01/2026', 'The end date must be on or after the start date'],
  ])('validates %s / %s against the chosen start date', (option, date, error) => {
    const result = validateForm(option, date, '2026-01-20')
    if (error) expect(result?.text).toBe(error)
    else expect(result).toBeNull()
  })
})
