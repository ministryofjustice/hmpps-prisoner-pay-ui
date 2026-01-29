import validateForm from './cancelRateChangeValidation'

describe('cancelValidation', () => {
  it('shows error if end date selection is not entered', () => {
    expect(validateForm(undefined)).toEqual({
      href: '#choice',
      text: 'Select cancellation option',
    })
  })
})
