import validateForm from './addPrisonerValidation'

describe('validateForm', () => {
  describe('Valid submit shows no errors', () => {
    it('returns the expected response for a valid submit', () => {
      expect(
        validateForm({
          query: 'some query',
        }),
      ).toBeNull()
    })
  })
  describe('query', () => {
    it('shows error if a query is not entered', () => {
      expect(
        validateForm({
          query: '',
        }),
      ).toEqual({
        href: '#query',
        text: 'Enter a search query',
      })
    })
  })
})
