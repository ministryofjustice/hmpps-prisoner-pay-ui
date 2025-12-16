import { RequestHandler, Router } from 'express'
import AddPrisonerHandler from './handlers/addPrisoner'
import AddPrisonerResultsHandler from './handlers/addPrisonerResults'
import { Services } from '../../services'

export default function Index(services: Services): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string, handler: RequestHandler) => router.get(path, handler)
  const post = (path: string, handler: RequestHandler) => router.post(path, handler)

  const addPrisonerHandler = new AddPrisonerHandler()
  get('/add-prisoner', addPrisonerHandler.GET)
  post('/add-prisoner', addPrisonerHandler.POST)

  const addPrisonerResultsHandler = new AddPrisonerResultsHandler(services.orchestratorService)
  get('/add-prisoner-results', addPrisonerResultsHandler.GET)
  post('/add-prisoner-results', addPrisonerResultsHandler.POST)

  return router
}
