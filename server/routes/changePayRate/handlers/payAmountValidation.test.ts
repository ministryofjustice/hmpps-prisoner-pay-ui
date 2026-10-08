import validateForm from './payAmountValidation'

describe('payAmountValidation', () => {
  describe('validateForm', () => {
    const minimumAmount = 65
    const payTypeDescription = 'Long-term sick'

    it.each(['abc', '1abc', '1.00abc', 'NaN', 'Infinity', '1e3', '0x10', '1.2.3'])(
      'rejects invalid amount %s',
      payAmount => {
        expect(validateForm({ payAmount }, minimumAmount, payTypeDescription)).toEqual({
          href: '#payAmount',
          text: 'Enter a valid pay amount',
        })
      },
    )

    it('rejects a blank amount', () => {
      expect(validateForm({ payAmount: ' ' }, minimumAmount, payTypeDescription)).toEqual({
        href: '#payAmount',
        text: 'You must enter a pay amount',
      })
    })

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

    it('rejects an amount just below the minimum without rounding it up', () => {
      expect(validateForm({ payAmount: '0.649' }, minimumAmount, payTypeDescription)).toEqual({
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
      const customMinimum = 150
      const result = validateForm({ payAmount: '1.00' }, customMinimum, payTypeDescription)

      expect(result).toEqual({
        href: '#payAmount',
        text: 'Long-term sick pay cannot be less than £1.50 per day',
      })
    })
  })
})
