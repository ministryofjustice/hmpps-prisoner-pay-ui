import { Request, Response } from 'express'
import OrchestratorService from '../../../services/orchestratorService'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'

export default class AddPrisonerResultsHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const payType = getPayTypeBySlug(req.params.payTypeSlug)
    const query = req.query.query as string
    const prisonerResults = this.orchestratorService.searchPrisoners(query)
    return res.render('pages/register/add-prisoner-results', { prisoners: prisonerResults.content, query, payType })
  }

  POST = async (req: Request, res: Response) => {
    const { prisonerNumber } = req.body
    const prisoner = this.orchestratorService.getPrisonerByPrisonerNumber(prisonerNumber)
    req.session!.selectedPrisoner = prisoner
    return res.redirect('end-date')
  }
}
