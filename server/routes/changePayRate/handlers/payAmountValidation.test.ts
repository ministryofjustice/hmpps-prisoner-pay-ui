import validateForm from './payAmountValidation'

describe('payAmountValidation', () => {
  describe('validateForm', () => {
    const minimumAmount = 0.65
    const payTypeDescription = 'Long-term sick'

    it('should return null when payAmount is valid and above minimum', () => {
      const result = validateForm({ payAmount: '1.00' }, minimumAmount, payTypeDescription)

      expect(result).toBeNull()
    })

    it('should return null when payAmount equals minimum', () => {
      const result = validateForm({ payAmount: '0.65' }, minimumAmount, payTypeDescription)

      expect(result).toBeNull()
    })

    it('should return MISSING_PAY_AMOUNT error when payAmount is empty', () => {
      const result = validateForm({ payAmount: '' }, minimumAmount, payTypeDescription)

      expect(result).toEqual({
        href: '#payAmount',
        text: 'You must enter a pay amount',
      })
    })

    it('should return PAY_AMOUNT_BELOW_MINIMUM error when payAmount is 0', () => {
      const result = validateForm({ payAmount: '0' }, minimumAmount, payTypeDescription)

      expect(result).toEqual({
        href: '#payAmount',
        text: 'Long-term sick pay cannot be less than £0.65 per day',
      })
    })

    it('should return PAY_AMOUNT_BELOW_MINIMUM error when payAmount is below minimum', () => {
      const result = validateForm({ payAmount: '0.50' }, minimumAmount, payTypeDescription)

      expect(result).toEqual({
        href: '#payAmount',
        text: 'Long-term sick pay cannot be less than £0.65 per day',
      })
    })

    it('should return PAY_AMOUNT_BELOW_MINIMUM error when payAmount is negative', () => {
      const result = validateForm({ payAmount: '-0.50' }, minimumAmount, payTypeDescription)

      expect(result).toEqual({
        href: '#payAmount',
        text: 'Long-term sick pay cannot be less than £0.65 per day',
      })
    })

    it('should use dynamic payTypeDescription in error message', () => {
      const customPayType = 'Retirement'
      const result = validateForm({ payAmount: '0.50' }, minimumAmount, customPayType)

      expect(result).toEqual({
        href: '#payAmount',
        text: 'Retirement pay cannot be less than £0.65 per day',
      })
    })

    it('should use dynamic minimumAmount in error message', () => {
      const customMinimum = 1.5
      const result = validateForm({ payAmount: '1.00' }, customMinimum, payTypeDescription)

      expect(result).toEqual({
        href: '#payAmount',
        text: 'Long-term sick pay cannot be less than £1.5 per day',
      })
    })
  })
})
