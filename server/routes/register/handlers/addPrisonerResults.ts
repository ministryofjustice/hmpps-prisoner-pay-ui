import { Request, Response } from 'express'
import OrchestratorService from '../../../services/orchestratorService'
import validateForm from './addPrisonerResultsValidation'
import AuditService, { Action, Page, SubjectType } from '../../../services/auditService'

export default class AddPrisonerResultsHandler {
  constructor(
    private readonly orchestratorService: OrchestratorService,
    private readonly auditService: AuditService,
  ) {}

  GET = async (req: Request, res: Response) => {
    const { activeCaseLoadId, username } = res.locals.user
    const query = req.query.query as string
    const prisonerResults = await this.orchestratorService.searchPrisoners(query, activeCaseLoadId)

    await this.auditService.logPageView(Page.ADD_PRISONER_RESULTS, {
      who: username,
      what: Action.VIEW_SEARCH_RESULT,
      subjectType: SubjectType.PRISONER_ID,
      details: {
        // TODO: Check if content is needed to map over
        searchResults: prisonerResults.map(prisoner => ({
          prisonerNumber: prisoner.prisonerNumber,
          cellLocation: prisoner.cellLocation,
        })),
      },
    })

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
