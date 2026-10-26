import { format } from 'date-fns'
import validateLastDay from './lastDayValidation'
import longTermSick from '../../../../statuses/longTermSick'

describe('lastDayValidation', () => {
  const today = new Date('2026-01-20T12:00:00Z')

  it.each([
    ['20/01/2026', '2026-01-20', null],
    ['21/01/2026', '2026-01-20', null],
    ['', '2026-01-20', 'Enter or select a date'],
    [undefined, '2026-01-20', 'Enter or select a date'],
    ['32/13/2026', '2026-01-20', 'Enter a real date'],
    ['31/02/2026', '2026-01-20', 'Enter a real date'],
    ['19/01/2026', '2026-01-20', 'Their last day must be today or in the future'],
    ['20/01/2026', '2026-01-21', 'Their last day must be today or in the future'],
    ['19/01/2026', '2026-01-18', 'The end date cannot be in the past'],
  ])('validates %s against start date %s', (date, start, error) => {
    const result = validateLastDay({ selectedDate: date }, longTermSick.lastDay, { startDate: start, today })
    if (error) expect(result).toEqual({ valid: false, errors: [{ href: '#selectedDate', text: error }] })
    else {
      expect(result.valid).toBe(true)
      if (result.valid === true) expect(format(result.date, 'dd/MM/yyyy')).toBe(date)
    }
  })
  it('allows a past date when configured, while retaining the start-date constraint', () => {
    const definition = { ...longTermSick.lastDay, rules: { allowPastDates: true } }
    const form = { selectedDate: '19/01/2026' }
    expect(validateLastDay(form, definition, { startDate: '2026-01-18', today }).valid).toBe(true)
    expect(validateLastDay(form, definition, { startDate: '2026-01-20', today })).toEqual({
      valid: false,
      errors: [{ href: '#selectedDate', text: 'Their last day must be today or in the future' }],
    })
  })

  it.each([
    ['', '2026-01-18', 'Example missing date'],
    ['invalid', '2026-01-18', 'Example invalid date'],
    ['19/01/2026', '2026-01-20', 'Example date before start'],
    ['19/01/2026', '2026-01-18', 'Example past date'],
  ])('uses configured errors for %s against %s', (selectedDate, startDate, text) => {
    const definition = {
      ...longTermSick.lastDay,
      errors: {
        missingDate: 'Example missing date',
        invalidDate: 'Example invalid date',
        beforeStartDate: 'Example date before start',
        pastDate: 'Example past date',
      },
    }
    expect(validateLastDay({ selectedDate }, definition, { startDate, today })).toEqual({
      valid: false,
      errors: [{ href: '#selectedDate', text }],
    })
  })
})
