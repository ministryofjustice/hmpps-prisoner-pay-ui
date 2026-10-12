import { addDays, format } from 'date-fns'
import validateForm from './setChangeDateValidation'

describe('setChangeDateValidation', () => {
  beforeEach(() => jest.useFakeTimers().setSystemTime(new Date('2026-03-20T12:00:00Z')))
  afterEach(() => jest.useRealTimers())

  describe('validateForm', () => {
    it.each([
      ['19/03/2026', 'The change date must be today or in the future'],
      ['31/02/2026', 'Enter a real date'],
      ['abc', 'Enter a real date'],
      ['aa/bb/cccc', 'Enter a real date'],
      [' ', 'Enter a change date'],
    ])('rejects date %s', (changeDate, text) => {
      expect(validateForm({ changeDateOption: 'other', changeDate })).toEqual({ href: '#changeDate', text })
    })

    it.each([0, 1, 30, 31, 365])('accepts a date %i days from today', days => {
      const changeDate = format(addDays(new Date(), days), 'dd/MM/yyyy')
      expect(validateForm({ changeDateOption: 'other', changeDate })).toBeNull()
    })

    it('should return null when changeDateOption is "tomorrow"', () => {
      const result = validateForm({ changeDateOption: 'tomorrow' })

      expect(result).toBeNull()
    })

    it('should return null when changeDateOption is "other" and changeDate is provided', () => {
      const tomorrow = addDays(new Date(), 2)
      const result = validateForm({ changeDateOption: 'other', changeDate: format(tomorrow, 'dd/MM/yyyy') })

      expect(result).toBeNull()
    })

    it('should return MISSING_CHANGE_DATE_OPTION error when changeDateOption is empty', () => {
      const result = validateForm({ changeDateOption: '' })

      expect(result).toEqual({
        href: '#changeDateOption',
        text: 'Select when you want the change to take effect',
      })
    })

    it('should return MISSING_CHANGE_DATE_OPTION error when changeDateOption is not provided', () => {
      const result = validateForm({ changeDateOption: undefined })

      expect(result).toEqual({
        href: '#changeDateOption',
        text: 'Select when you want the change to take effect',
      })
    })

    it('should return MISSING_CHANGE_DATE error when changeDateOption is "other" and changeDate is empty', () => {
      const result = validateForm({ changeDateOption: 'other', changeDate: '' })

      expect(result).toEqual({
        href: '#changeDate',
        text: 'Enter a change date',
      })
    })

    it('should return MISSING_CHANGE_DATE error when changeDateOption is "other" and changeDate is not provided', () => {
      const result = validateForm({ changeDateOption: 'other' })

      expect(result).toEqual({
        href: '#changeDate',
        text: 'Enter a change date',
      })
    })
  })
})
