import { Request, Response, NextFunction } from 'express'
import { getPayTypeBySlug } from '../utils/payTypeUtils'
import { getSingleParam } from '../utils/utils'

export default function setPayType(req: Request, res: Response, next: NextFunction) {
  const payTypeSlug = getSingleParam(req.params.payTypeSlug)
  if (payTypeSlug) {
    const payType = getPayTypeBySlug(payTypeSlug)
    res.locals.payType = payType
  }
  next()
}
