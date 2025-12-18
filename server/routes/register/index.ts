import { RequestHandler, Router } from 'express'
import AddPrisonerHandler from './handlers/addPrisoner'
import EndDateHandler from './handlers/endDate'
import { Services } from '../../services'

export default function Index({ orchestratorService }: Services): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string, handler: RequestHandler) => router.get(path, handler)
  const post = (path: string, handler: RequestHandler) => router.post(path, handler)

  const addPrisonerHandler = new AddPrisonerHandler()
  const endDateHandler = new EndDateHandler(orchestratorService)

  get('/add-prisoner', addPrisonerHandler.GET)
  post('/add-prisoner', addPrisonerHandler.POST)
  post('/end-date', endDateHandler.POST)
  get('/end-date', endDateHandler.GET)

  return router
}
