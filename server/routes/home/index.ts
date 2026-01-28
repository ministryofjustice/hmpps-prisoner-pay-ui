import { RequestHandler, Router } from 'express'
import HomeRoutes from './handlers/home'

export default function Index(): Router {
  const router = Router()

  const get = (path: string, handler: RequestHandler) => router.get(path, handler)

  const homeHandler = new HomeRoutes()

  get('/home', homeHandler.GET)

  return router
}
