import validateCancellation from './cancelValidation'
import longTermSick from '../../../../statuses/longTermSick'

describe('cancellation validation', () => {
  it.each(['yes', 'no'])('accepts %s', choice => {
    expect(validateCancellation({ choice }, longTermSick.cancellation)).toEqual({ valid: true, choice })
  })

  it.each([undefined, '', 'invalid'])('rejects %s', choice => {
    expect(validateCancellation({ choice }, longTermSick.cancellation)).toEqual({
      valid: false,
      errors: [{ href: '#choice', text: 'Select cancellation option' }],
    })
  })

  it('rejects an excluded choice with the configured error', () => {
    expect(
      validateCancellation(
        { choice: 'yes' },
        {
          ...longTermSick.cancellation,
          options: ['no'],
          errors: { missingOption: 'Choose the available action' },
        },
      ),
    ).toEqual({ valid: false, errors: [{ href: '#choice', text: 'Choose the available action' }] })
  })
})
