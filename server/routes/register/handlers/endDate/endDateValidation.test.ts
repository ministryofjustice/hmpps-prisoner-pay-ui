import validateEndDate from './endDateValidation'
import longTermSick from '../../../../statuses/longTermSick'

describe('endDateValidation', () => {
  it.each(['yes', 'no'])('accepts %s', endDateSelection => {
    expect(validateEndDate({ endDateSelection }, longTermSick.endDate)).toEqual({
      valid: true,
      selection: endDateSelection,
    })
  })

  it.each([undefined, '', 'invalid'])('rejects %s', endDateSelection => {
    expect(validateEndDate({ endDateSelection }, longTermSick.endDate)).toEqual({
      valid: false,
      errors: [{ href: '#endDateSelection', text: 'Select if you want to set their last day or not' }],
    })
  })

  it('rejects a choice excluded by the definition using its configured message', () => {
    expect(
      validateEndDate(
        { endDateSelection: 'no' },
        {
          ...longTermSick.endDate,
          options: ['yes'],
          errors: { missingOption: 'Choose the available option' },
        },
      ),
    ).toEqual({ valid: false, errors: [{ href: '#endDateSelection', text: 'Choose the available option' }] })
  })
})
