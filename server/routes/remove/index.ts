import { RequestHandler, Router } from 'express'
import RemovalDateHandler from './handlers/removalDate'
import ConfirmedRemovalDateHandler from './handlers/confirmedRemovalDate'
import CheckRemovalDateHandler from './handlers/checkRemovalDate'
import { Services } from '../../services'
import setPayType from '../../middleware/setPayType'

export default function Index(services: Services): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string, handler: RequestHandler) => router.get(path, handler)
  const post = (path: string, handler: RequestHandler) => router.post(path, handler)

  router.use(setPayType)

  const removalDateHandler = new RemovalDateHandler(services.orchestratorService)
  get('/removal-date', removalDateHandler.GET)
  post('/removal-date', removalDateHandler.POST)

  const checkRemovalDateHandler = new CheckRemovalDateHandler(services.orchestratorService, services.prisonerPayService)
  get('/check-removal-date', checkRemovalDateHandler.GET)
  post('/check-removal-date', checkRemovalDateHandler.POST)

  const confirmedRemovalDateHandler = new ConfirmedRemovalDateHandler(services.orchestratorService)
  get('/confirmed-removal-date', confirmedRemovalDateHandler.GET)

  return router
}
