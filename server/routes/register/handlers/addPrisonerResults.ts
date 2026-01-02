import { Request, Response } from 'express'
import OrchestratorService from '../../../services/orchestratorService'
import validateForm from './addPrisonerResultsValidation'

export default class AddPrisonerResultsHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const query = req.query.query as string
    const prisonerResults = this.orchestratorService.searchPrisoners(query)
    return res.render('pages/register/add-prisoner-results', { prisoners: prisonerResults.content, query })
  }

  POST = async (req: Request, res: Response) => {
    const query = req.query.query as string
    const { selectedPrisoner } = req.body
    const errors = validateForm({ selectedPrisoner })
    if (errors) {
      const prisonerResults = this.orchestratorService.searchPrisoners(query)
      return res.render('pages/register/add-prisoner-results', {
        errors: [errors],
        selectedPrisoner,
        query,
        prisoners: prisonerResults.content,
      })
    }

    const prisoner = this.orchestratorService.getPrisonerByPrisonerNumber(selectedPrisoner)
    req.session!.selectedPrisoner = prisoner
    return res.redirect('end-date')
  }
}
