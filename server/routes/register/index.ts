import { RequestHandler, Router } from 'express'
import AddPrisonerHandler from './handlers/addPrisoner'

export default function Index(): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string, handler: RequestHandler) => router.get(path, handler)
  const post = (path: string, handler: RequestHandler) => router.post(path, handler)

  const addPrisonerHandler = new AddPrisonerHandler()

  get('/add-prisoner', addPrisonerHandler.GET)
  post('/add-prisoner', addPrisonerHandler.POST)

  return router
}
