import { Request, Response, NextFunction } from 'express'
import { getPayTypeBySlug } from '../utils/payTypeUtils'

export default function setPayType(req: Request, res: Response, next: NextFunction) {
  if (req.params.payTypeSlug) {
    const payType = getPayTypeBySlug(req.params.payTypeSlug)
    res.locals.payType = payType
  }
  next()
}
