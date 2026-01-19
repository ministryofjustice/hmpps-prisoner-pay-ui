enum PayType {
  LONG_TERM_SICK = 'LONG_TERM_SICK',
  SHORT_TERM_SICK = 'SHORT_TERM_SICK',
}

export interface PayTypeConfig {
  type: PayType
  description: string
  slug: string
  dailyPayAmount: number
}

export default PayType
