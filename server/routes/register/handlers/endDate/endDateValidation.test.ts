import validateForm from './endDateValidation'

describe('endDateValidation', () => {
  it.each(['yes', 'no'])('accepts %s', endDateSelection => {
    expect(validateForm(endDateSelection)).toBeNull()
  })

  it.each([undefined, '', 'invalid'])('rejects %s', endDateSelection => {
    expect(validateForm(endDateSelection)).toEqual({
      href: '#endDateSelection',
      text: 'Select if you want to set their last day or not',
    })
  })
})
