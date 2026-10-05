import validateForm from './startDateValidation'

describe('start date validation', () => {
  beforeEach(() => jest.useFakeTimers().setSystemTime(new Date('2026-01-07T12:00:00Z')))
  afterEach(() => jest.useRealTimers())

  it.each(['today', 'tomorrow'])('accepts %s without custom date values', startDateOption => {
    expect(validateForm({ startDateOption, startDate: 'invalid' })).toBeNull()
  })

  it.each([undefined, '', 'invalid'])('rejects invalid option %s', startDateOption => {
    expect(validateForm({ startDateOption })?.href).toBe('#startDateOption')
  })

  it.each([
    ['', 'Enter or select a start date'],
    ['31/02/2026', 'Enter a real start date'],
    ['29/02/2027', 'Enter a real start date'],
    ['abc', 'Enter a real start date'],
    ['06/01/2026', 'The start date must be today or in the future'],
  ])('validates %s', (startDate, text) => {
    expect(validateForm({ startDateOption: 'other', startDate })).toEqual({ href: '#startDate', text })
  })

  it.each(['07/01/2026', '08/01/2026', '20/01/2026', '29/02/2028'])(
    'accepts today, tomorrow or a future date: %s',
    startDate => {
      expect(validateForm({ startDateOption: 'other', startDate })).toBeNull()
    },
  )
})
