import validateForm from './endDateValidation'

describe('validateForm', () => {
  describe('Select end date option', () => {
    it('shows error if a query is not entered', () => {
      expect(validateForm(undefined)).toEqual({
        href: '#endDateSelection',
        text: 'Select end date option',
      })
    })
  })
})
