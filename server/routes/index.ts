import { Router } from 'express'

import type { Services } from '../services'
import DashboardRoutes from './dashboard'

export default function routes(services: Services): Router {
  const router = Router()

  router.use('/', DashboardRoutes())
  return router
}
