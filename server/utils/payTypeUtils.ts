import PayType from '../@types/payTypes'

const payTypes = [
  {
    type: PayType.LONG_TERM_SICK,
    description: 'Long-term sick',
    slug: 'long-term-sick',
    dailyPayAmount: 65,
  },
]

export const getPayTypeBySlug = (slug: string) => {
  return payTypes.find(payType => payType.slug === slug)
}

export const getAllPayTypes = () => {
  return payTypes
}
