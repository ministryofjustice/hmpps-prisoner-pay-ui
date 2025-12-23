import { RequestHandler, Router } from 'express'
import DashboardHandler from './handlers/dashboard'
import PayOverviewHandler from './handlers/payOverview'
import { Services } from '../../services'

export default function Index({ orchestratorService }: Services): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string, handler: RequestHandler) => router.get(path, handler)

  const dashboardHandler = new DashboardHandler(orchestratorService)
  get('/', dashboardHandler.GET)

  const payOverviewHandler = new PayOverviewHandler(orchestratorService)
  get('/:payTypeSlug/pay-overview', payOverviewHandler.GET)

  return router
}
