import { RequestHandler, Router } from 'express'
import DashboardHandler from './handlers/dashboard'

export default function Index(): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string, handler: RequestHandler) => router.get(path, handler)

  const dashboardHandler = new DashboardHandler()

  get('/', dashboardHandler.get)

  return router
}
