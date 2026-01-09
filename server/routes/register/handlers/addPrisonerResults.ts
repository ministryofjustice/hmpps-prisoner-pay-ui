import { Request, Response } from 'express'
import OrchestratorService from '../../../services/orchestratorService'
import validateForm from './addPrisonerResultsValidation'

export default class AddPrisonerResultsHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const { activeCaseLoadId } = res.locals.user
    const query = req.query.query as string
    const prisonerResults = await this.orchestratorService.searchPrisoners(query, activeCaseLoadId)
    return res.render('pages/register/add-prisoner-results', { prisoners: prisonerResults, query })
  }

  POST = async (req: Request, res: Response) => {
    const { activeCaseLoadId } = res.locals.user
    const { selectedPrisoner } = req.body
    const query = req.query.query as string
    const prisonerResults = await this.orchestratorService.searchPrisoners(query, activeCaseLoadId)

    const errors = validateForm({ selectedPrisoner })
    if (errors) {
      return res.render('pages/register/add-prisoner-results', {
        errors: [errors],
        selectedPrisoner,
        query,
        prisoners: prisonerResults,
      })
    }

    const prisoner = prisonerResults.find(p => p.prisonerNumber === selectedPrisoner)
    req.session!.selectedPrisoner = prisoner
    return res.redirect('end-date')
  }
}
