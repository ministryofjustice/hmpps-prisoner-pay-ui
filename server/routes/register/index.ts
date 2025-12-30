import { RequestHandler, Router } from 'express'
import AddPrisonerHandler from './handlers/addPrisoner'
import ConfirmedAddPrisonerHandler from './handlers/confirmedAddPrisoner'
import AddPrisonerResultsHandler from './handlers/addPrisonerResults'
import CheckHandler from './handlers/check'
import EndDateHandler from './handlers/endDate'
import { Services } from '../../services'

export default function Index(services: Services): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string, handler: RequestHandler) => router.get(path, handler)
  const post = (path: string, handler: RequestHandler) => router.post(path, handler)

  const addPrisonerHandler = new AddPrisonerHandler()
  get('/add-prisoner', addPrisonerHandler.GET)
  post('/add-prisoner', addPrisonerHandler.POST)

  const endDateHandler = new EndDateHandler(services.orchestratorService)
  post('/end-date', endDateHandler.POST)
  get('/end-date', endDateHandler.GET)

  const checkHandler = new CheckHandler(services.prisonerPayService)
  get('/check', checkHandler.GET)
  post('/check', checkHandler.POST)

  const addPrisonerResultsHandler = new AddPrisonerResultsHandler(services.orchestratorService)
  get('/add-prisoner-results', addPrisonerResultsHandler.GET)
  post('/add-prisoner-results', addPrisonerResultsHandler.POST)

  const confirmedAddPrisonerHandler = new ConfirmedAddPrisonerHandler()
  get('/confirmed-add-prisoner', confirmedAddPrisonerHandler.GET)
  post('/confirmed-add-prisoner', confirmedAddPrisonerHandler.POST)

  return router
}
