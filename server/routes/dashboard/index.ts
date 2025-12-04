import { RequestHandler, Router } from 'express'
import DashboardHandler from './handlers/dashboard'
import PayOverviewHandler from './handlers/payOverview'

export default function Index(): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string, handler: RequestHandler) => router.get(path, handler)
  const post = (path: string, handler: RequestHandler) => router.post(path, handler)

  const dashboardHandler = new DashboardHandler()
  const payOverviewHandler = new PayOverviewHandler()

  get('/', dashboardHandler.GET)
  get('/pay-overview', payOverviewHandler.GET)

  post('/pay-overview', payOverviewHandler.POST)

  return router
}
