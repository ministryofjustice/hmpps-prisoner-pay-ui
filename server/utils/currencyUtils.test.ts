import { currencyFromPence, penceToPounds, poundsToPence } from './currencyUtils'

describe('currency utils', () => {
  it.each([
    [0, 0],
    [0.65, 65],
    [1, 100],
    [1.13, 113],
    [3.25, 325],
    [1234.56, 123456],
  ])('converts %s pounds to %s pence and back', (pounds, pence) => {
    expect(poundsToPence(pounds)).toBe(pence)
    expect(penceToPounds(pence)).toBe(pounds)
  })

  it.each([
    [0, '£0'],
    [65, '£0.65'],
    [99, '£0.99'],
    [100, '£1'],
    [150, '£1.50'],
    [325, '£3.25'],
    [123456, '£1,234.56'],
    [-65, '-£0.65'],
  ])('formats %s pence as %s', (pence, expected) => {
    expect(currencyFromPence(pence)).toBe(expected)
  })

  it.each([undefined, null, NaN, Infinity, -Infinity, '65'])('handles invalid amount %s', pence => {
    expect(currencyFromPence(pence as number)).toBe('?')
  })
})
