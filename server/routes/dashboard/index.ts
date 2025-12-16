import { RequestHandler, Router } from 'express'
import DashboardHandler from './handlers/dashboard'
import PayOverviewHandler from './handlers/payOverview'
import EndDateHandler from './handlers/endDate'
import { Services } from '../../services'

export default function Index({ orchestratorService }: Services): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string, handler: RequestHandler) => router.get(path, handler)
  const post = (path: string, handler: RequestHandler) => router.post(path, handler)

  const endDateHandler = new EndDateHandler(orchestratorService)
  const dashboardHandler = new DashboardHandler(orchestratorService)
  const payOverviewHandler = new PayOverviewHandler(orchestratorService)

  get('/', dashboardHandler.GET)

  get('/:payTypeSlug/pay-overview', payOverviewHandler.GET)
  get('/:payTypeSlug/end-date', endDateHandler.GET)
  post('/:payTypeSlug/pay-overview', payOverviewHandler.POST)
  post('/:payTypeSlug/end-date', endDateHandler.POST)

  return router
}
