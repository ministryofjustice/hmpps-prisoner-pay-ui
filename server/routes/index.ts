import { Router } from 'express'

import type { Services } from '../services'
import DashboardRoutes from './dashboard'
import RegisterRoutes from './register'

export default function routes(services: Services): Router {
  const router = Router()

  router.use('/', DashboardRoutes(services))
  router.use('/:payTypeSlug/register', RegisterRoutes())
  return router
}
