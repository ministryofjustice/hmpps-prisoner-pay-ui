import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import { getPayTypeBySlug } from '../utils/payTypeUtils'
import { getSingleParam } from '../utils/utils'

export default function setPayType(req: Request, res: Response, next: NextFunction) {
  const payTypeSlug = getSingleParam(req.params.payTypeSlug)
  if (payTypeSlug) {
    const payType = getPayTypeBySlug(payTypeSlug)
    if (!payType) return next(createError(404, 'Pay type not found'))
    res.locals.payType = payType
  }
  return next()
}
