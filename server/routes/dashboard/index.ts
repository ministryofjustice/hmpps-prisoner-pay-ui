import { RequestHandler, Router } from 'express'
import DashboardHandler from './handlers/dashboard'
import PayRatesHandler from './handlers/payRates'
import PayOverviewHandler from './handlers/payOverview'
import { Services } from '../../services'

export default function Index({ orchestratorService, auditService }: Services): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string, handler: RequestHandler) => router.get(path, handler)

  const dashboardHandler = new DashboardHandler(orchestratorService, auditService)
  get('/', dashboardHandler.GET)

  const payOverviewHandler = new PayOverviewHandler(orchestratorService, auditService)
  get('/:payTypeSlug/pay-overview', payOverviewHandler.GET)

  const payRatesHandler = new PayRatesHandler(orchestratorService)
  get('/pay-rates', payRatesHandler.GET)

  return router
}
