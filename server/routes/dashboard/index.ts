import { RequestHandler, Router } from 'express'
import DashboardHandler from './handlers/dashboard'
import LongTermSickHandler from './handlers/longTermSick'
import PayOverviewHandler from './handlers/payOverview'
import { Services } from '../../services'

export default function Index({ orchestratorService }: Services): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string, handler: RequestHandler) => router.get(path, handler)
  const post = (path: string, handler: RequestHandler) => router.post(path, handler)

  const dashboardHandler = new DashboardHandler(orchestratorService)
  const payOverviewHandler = new PayOverviewHandler()
  const longTermSickHandler = new LongTermSickHandler(orchestratorService)

  get('/', dashboardHandler.GET)
  get('/pay-overview', payOverviewHandler.GET)
  get('/long-term-sick', longTermSickHandler.GET)

  post('/pay-overview', payOverviewHandler.POST)
  post('/long-term-sick', longTermSickHandler.POST)

  return router
}
