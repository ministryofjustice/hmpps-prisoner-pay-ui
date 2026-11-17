import PayType from '../@types/payTypes'
import longTermSick from './longTermSick'
import shortTermSick from './shortTermSick'
import { StatusDefinition } from './types'

const definitions: Partial<Record<PayType, StatusDefinition>> = {
  [PayType.LONG_TERM_SICK]: longTermSick,
  [PayType.SHORT_TERM_SICK]: shortTermSick,
}

export default function getStatusDefinition(type: PayType): StatusDefinition {
  const definition = definitions[type]
  if (!definition) throw new Error(`No status definition configured for ${type}`)
  return definition
}
