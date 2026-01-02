import validateForm from './addPrisonerResultsValidation'

describe('validateForm', () => {
  describe('Valid submit shows no errors', () => {
    it('returns the expected response for a valid submit', () => {
      expect(
        validateForm({
          prisonerNumber: 'A1234BC',
        }),
      ).toBeNull()
    })
  })
  describe('prisonerNumber', () => {
    it('shows error if a prisoner number is not entered', () => {
      expect(
        validateForm({
          prisonerNumber: '',
        }),
      ).toEqual({
        href: '#prisonerNumber',
        text: 'Select a prisoner to add',
      })
    })
  })
})
