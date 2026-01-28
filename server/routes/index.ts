import { Router } from 'express'
import homeRoutes from './home'
import type { Services } from '../services'
import DashboardRoutes from './dashboard'
import RegisterRoutes from './register'
import RemoveRoutes from './remove'
import ChangePayRateRoutes from './changePayRate'
import timeNowMiddleware from '../middleware/timeNowMiddleware'
import checkForSuccessMessages from '../middleware/checkForSuccessMessages'

export default function routes(services: Services): Router {
  const router = Router()

  router.use(timeNowMiddleware())
  router.use(checkForSuccessMessages())

  router.use(homeRoutes())
  router.use('/', DashboardRoutes(services))
  router.use('/:payTypeSlug/register', RegisterRoutes(services))
  router.use('/:payTypeSlug/remove/:payStatusId', RemoveRoutes(services))
  router.use('/:payTypeSlug/change-pay-rate', ChangePayRateRoutes())
  return router
}
