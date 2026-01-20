import { Request, Response } from 'express'
import OrchestratorService from '../../../services/orchestratorService'
import validateForm from './addPrisonerResultsValidation'
import { Action, Page, SubjectType } from '../../../services/auditService'
import { auditPageAction, auditPageView, getDisplayedResults } from '../../../utils/auditUtils'

export default class AddPrisonerResultsHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const { activeCaseLoadId } = res.locals.user
    const query = req.query.query as string
    const prisonerResults = await this.orchestratorService.searchPrisoners(query, activeCaseLoadId)

    await auditPageView(
      req,
      Page.ADD_PRISONER_RESULTS,
      getDisplayedResults(prisonerResults),
      SubjectType.PRISONER_ID,
      Action.VIEW_SEARCH_RESULT,
    )

    const errors =
      prisonerResults.length === 0
        ? [
            {
              text: 'No people found matching that name or prison number',
              href: '#query',
            },
          ]
        : []

    return res.render('pages/register/add-prisoner-results', { prisoners: prisonerResults, query, errors })
  }

  POST = async (req: Request, res: Response) => {
    const { activeCaseLoadId } = res.locals.user
    const { selectedPrisoner } = req.body
    const query = req.query.query as string
    const prisonerResults = await this.orchestratorService.searchPrisoners(query, activeCaseLoadId)
    await auditPageAction(req, Page.ADD_PRISONER, Action.SEARCH_PRISONER, { query }, SubjectType.SEARCH_TERM)

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
