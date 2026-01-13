import { RequestHandler, Router } from 'express'
import AddPrisonerHandler from './handlers/addPrisoner'
import ConfirmedAddPrisonerHandler from './handlers/confirmedAddPrisoner'
import AddPrisonerResultsHandler from './handlers/addPrisonerResults'
import CheckHandler from './handlers/check'
import EndDateHandler from './handlers/endDate'
import { Services } from '../../services'
import setPayType from '../../middleware/setPayType'

export default function Index(services: Services): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string, handler: RequestHandler) => router.get(path, handler)
  const post = (path: string, handler: RequestHandler) => router.post(path, handler)

  router.use(setPayType)

  const addPrisonerHandler = new AddPrisonerHandler(services.auditService)
  get('/add-prisoner', addPrisonerHandler.GET)
  post('/add-prisoner', addPrisonerHandler.POST)

  const endDateHandler = new EndDateHandler(services.orchestratorService, services.auditService)
  post('/end-date', endDateHandler.POST)
  get('/end-date', endDateHandler.GET)

  const checkHandler = new CheckHandler(services.prisonerPayService, services.auditService)
  get('/check', checkHandler.GET)
  post('/check', checkHandler.POST)

  const addPrisonerResultsHandler = new AddPrisonerResultsHandler(services.orchestratorService, services.auditService)
  get('/add-prisoner-results', addPrisonerResultsHandler.GET)
  post('/add-prisoner-results', addPrisonerResultsHandler.POST)

  const confirmedAddPrisonerHandler = new ConfirmedAddPrisonerHandler(services.auditService)
  get('/confirmed-add-prisoner', confirmedAddPrisonerHandler.GET)

  return router
}
