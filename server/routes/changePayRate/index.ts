import { RequestHandler, Router } from 'express'
import PayAmountHandler from './handlers/payAmount'
import setPayType from '../../middleware/setPayType'

export default function Index(): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string, handler: RequestHandler) => router.get(path, handler)
  const post = (path: string, handler: RequestHandler) => router.post(path, handler)

  router.use(setPayType)

  const payAmountHandler = new PayAmountHandler()
  get('/pay-amount', payAmountHandler.GET)
  post('/pay-amount', payAmountHandler.POST)

  return router
}
