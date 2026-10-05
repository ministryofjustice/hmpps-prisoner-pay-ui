import { RequestHandler, Router } from 'express'
import AddPrisonerHandler from './handlers/search/addPrisoner'
import ConfirmedAddPrisonerHandler from './handlers/confirmation/confirmedAddPrisoner'
import AddPrisonerResultsHandler from './handlers/search/addPrisonerResults'
import CancelHandler from './handlers/cancel/cancel'
import CheckHandler from './handlers/check/check'
import EndDateHandler from './handlers/endDate/endDate'
import StartDateHandler from './handlers/startDate/startDate'
import { Services } from '../../services'
import setPayType from '../../middleware/setPayType'

export default function Index(services: Services): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string, handler: RequestHandler) => router.get(path, handler)
  const post = (path: string, handler: RequestHandler) => router.post(path, handler)

  router.use(setPayType)

  const addPrisonerHandler = new AddPrisonerHandler()
  get('/new', addPrisonerHandler.startNewRegistration)
  get('/add-prisoner', addPrisonerHandler.GET)
  post('/add-prisoner', addPrisonerHandler.POST)

  const cancelHandler = new CancelHandler()
  get('/cancel', cancelHandler.GET)
  post('/cancel', cancelHandler.POST)

  const startDateHandler = new StartDateHandler()
  get('/start-date', startDateHandler.GET)
  post('/start-date', startDateHandler.POST)

  const endDateHandler = new EndDateHandler()
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

  return router
}
