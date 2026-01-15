import validateForm from './endDateValidation'

describe('endDateValidation', () => {
  it('passes when no end date is selected', () => {
    expect(validateForm('no', '')).toBeNull()
  })

  it('passes when a valid future date is entered', () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)
    const formattedDate = `${String(futureDate.getDate()).padStart(2, '0')}/${String(futureDate.getMonth() + 1).padStart(2, '0')}/${futureDate.getFullYear()}`
    expect(validateForm('yes', formattedDate)).toBeNull()
  })

  it('shows error if end date selection is not entered', () => {
    expect(validateForm(undefined, '')).toEqual({
      href: '#endDateSelection',
      text: 'Select end date option',
    })
  })

  it('shows error if date is not entered when yes is selected', () => {
    expect(validateForm('yes', '')).toEqual({
      href: '#selectedDate',
      text: 'Enter or select a date',
    })
  })

  it('shows error if date is not valid', () => {
    expect(validateForm('yes', '32/13/2025')).toEqual({
      href: '#selectedDate',
      text: 'Enter a real date',
    })
  })

  it('shows error if date is in the past', () => {
    expect(validateForm('yes', '01/01/2020')).toEqual({
      href: '#selectedDate',
      text: 'The date must be after today',
    })
  })
})
