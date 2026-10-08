/** Convert a pound amount to whole pence, avoiding floating-point fractions. */
export const poundsToPence = (pounds: number): number => Math.round((pounds + Number.EPSILON) * 100)

export const penceToPounds = (pence: number): number => pence / 100

/** Format pence as pounds, omitting .00 for whole pounds. */
export const currencyFromPence = (pence: number): string => {
  if (typeof pence !== 'number' || !Number.isFinite(pence)) return '?'

  const formatted = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    useGrouping: true,
  }).format(penceToPounds(pence))

  return formatted.endsWith('.00') ? formatted.slice(0, -3) : formatted
}
