import { Request, Response, NextFunction } from 'express'
import { getPayTypeBySlug } from '../utils/payTypeUtils'

export default function setPayType(req: Request, res: Response, next: NextFunction) {
  console.log('setPayType')
  console.log(req.params)

  const payType = getPayTypeBySlug(req.params.payTypeSlug)
  res.locals.payType = payType
  console.log(payType)

  next()
}
