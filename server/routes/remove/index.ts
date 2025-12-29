import { RequestHandler, Router } from 'express'
import RemovalDateHandler from './handlers/removalDate'
import ConfirmRemovalDateHandler from './handlers/confirmRemovalDate'
import { Services } from '../../services'

export default function Index(services: Services): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string, handler: RequestHandler) => router.get(path, handler)
  const post = (path: string, handler: RequestHandler) => router.post(path, handler)

  const removalDateHandler = new RemovalDateHandler(services.orchestratorService)
  get('/removal-date', removalDateHandler.GET)
  post('/removal-date', removalDateHandler.POST)

  const confirmRemovalDateHandler = new ConfirmRemovalDateHandler(
    services.orchestratorService,
    services.prisonerPayService,
  )
  get('/confirm-removal-date', confirmRemovalDateHandler.GET)
  post('/confirm-removal-date', confirmRemovalDateHandler.POST)

  return router
}
