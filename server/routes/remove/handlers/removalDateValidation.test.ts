import validateForm from './removalDateValidation'

describe('validateForm', () => {
  describe('Valid submit shows no errors', () => {
    it('returns valid for submit with removalDateOption as today', () => {
      expect(
        validateForm({
          removalDateOption: 'today',
        }),
      ).toBeNull()
    })

    it('returns valid for submit with removalDateOption other and removalDate', () => {
      expect(
        validateForm({
          removalDateOption: 'other',
          removalDate: '25/12/2025',
        }),
      ).toBeNull()
    })
  })

  describe('removalDateOption', () => {
    it('shows error if removalDateOption is not provided', () => {
      expect(
        validateForm({
          removalDateOption: '',
        }),
      ).toEqual({
        href: '#removalDateOption',
        text: 'Select a removal date option',
      })
    })
  })

  describe('removalDate', () => {
    it('shows error if removalDateOption is other but removalDate is not provided', () => {
      expect(
        validateForm({
          removalDateOption: 'other',
          removalDate: '',
        }),
      ).toEqual({
        href: '#removalDate',
        text: 'Enter a removal date',
      })
    })

    it('shows error if removalDateOption is other but removalDate is undefined', () => {
      expect(
        validateForm({
          removalDateOption: 'other',
        }),
      ).toEqual({
        href: '#removalDate',
        text: 'Enter a removal date',
      })
    })

    it('does not require removalDate if removalDateOption is today', () => {
      expect(
        validateForm({
          removalDateOption: 'today',
          removalDate: '',
        }),
      ).toBeNull()
    })
  })
})
