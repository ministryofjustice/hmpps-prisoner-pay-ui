import validateForm from './lastDayValidation'

describe('lastDayValidation', () => {
  beforeEach(() => jest.useFakeTimers().setSystemTime(new Date('2026-01-20T12:00:00Z')))
  afterEach(() => jest.useRealTimers())

  it.each([
    ['20/01/2026', '2026-01-20', null],
    ['21/01/2026', '2026-01-20', null],
    ['', '2026-01-20', 'Enter or select a date'],
    [undefined, '2026-01-20', 'Enter or select a date'],
    ['32/13/2026', '2026-01-20', 'Enter a real date'],
    ['31/02/2026', '2026-01-20', 'Enter a real date'],
    ['19/01/2026', '2026-01-20', 'The end date must be on or after the start date'],
    ['20/01/2026', '2026-01-21', 'The end date must be on or after the start date'],
    ['19/01/2026', '2026-01-18', 'The end date cannot be in the past'],
  ])('validates %s against start date %s', (date, start, error) => {
    const result = validateForm(date, start)
    if (error) expect(result).toEqual({ href: '#selectedDate', text: error })
    else expect(result).toBeNull()
  })
})
