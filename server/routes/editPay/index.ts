import { RequestHandler, Router } from 'express'
import EditPayHandler from './handlers/home'

export default function Index(): Router {
  const router = Router()

  const get = (path: string, handler: RequestHandler) => router.get(path, handler)

  const editPayHandler = new EditPayHandler()
  get('/', editPayHandler.GET)

  return router
}
