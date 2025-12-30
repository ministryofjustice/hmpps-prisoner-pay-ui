import { Request, Response } from 'express'
import OrchestratorService from '../../../services/orchestratorService'

export default class AddPrisonerResultsHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const query = req.query.query as string
    const prisonerResults = this.orchestratorService.searchPrisoners(query)
    return res.render('pages/register/add-prisoner-results', { prisoners: prisonerResults.content, query })
  }

  POST = async (req: Request, res: Response) => {
    const { prisonerNumber } = req.body
    const prisoner = this.orchestratorService.getPrisonerByPrisonerNumber(prisonerNumber)
    req.session!.selectedPrisoner = prisoner
    return res.redirect('end-date')
  }
}
