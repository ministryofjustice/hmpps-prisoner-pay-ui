import { addDays, format } from 'date-fns'
import validateForm from './setChangeDateValidation'

describe('setChangeDateValidation', () => {
  describe('validateForm', () => {
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
