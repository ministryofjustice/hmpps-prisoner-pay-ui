import validateForm from './addPrisonerResultsValidation'

describe('validateForm', () => {
  describe('Valid submit shows no errors', () => {
    it('returns the expected response for a valid submit', () => {
      expect(
        validateForm({
          selectedPrisoner: 'A1234BC',
        }),
      ).toBeNull()
    })
  })
  describe('selectedPrisoner', () => {
    it('shows error if a prisoner number is not entered', () => {
      expect(
        validateForm({
          selectedPrisoner: '',
        }),
      ).toEqual({
        href: '#selectedPrisoner',
        text: 'Select a prisoner to add',
      })
    })
  })
})
