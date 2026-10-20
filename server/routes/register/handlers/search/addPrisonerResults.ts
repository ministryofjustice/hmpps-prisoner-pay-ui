import { Request, Response } from 'express'
import { FormError } from '../../../../@types/template'
import { formatName } from '../../../../utils/utils'
import { NameFormatStyle } from '../../../../utils/helpers/nameFormatStyle'
import OrchestratorService from '../../../../services/orchestratorService'
import validateForm from './addPrisonerResultsValidation'
import { Action, Page, SubjectType } from '../../../../services/auditService'
import { auditPageAction, auditPageView, getDisplayedResults } from '../../../../utils/auditUtils'

export default class AddPrisonerResultsHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  private render = (
    res: Response,
    prisoners: Awaited<ReturnType<OrchestratorService['searchPrisoners']>>,
    query: string,
    errors: FormError[],
    selectedPrisoner?: string,
  ) =>
    res.render('pages/register/add-prisoner-results', {
      prisoners,
      query,
      errors,
      selectedPrisoner,
      prisonerRadios: Object.fromEntries(
        prisoners.map(prisoner => [
          prisoner.prisonerNumber,
          {
            name: 'selectedPrisoner',
            idPrefix: `selected-prisoner-${prisoner.prisonerNumber}`,
            classes: 'govuk-radios--small',
            value: selectedPrisoner,
            items: [
              {
                id: `selected-prisoner-${prisoner.prisonerNumber}`,
                value: prisoner.prisonerNumber,
                attributes: errors.some(error => error.href === '#selectedPrisoner')
                  ? { 'aria-describedby': 'selectedPrisoner-error' }
                  : undefined,
                text: formatName(
                  prisoner.firstName,
                  undefined,
                  prisoner.lastName,
                  NameFormatStyle.lastCommaFirst,
                  false,
                ),
              },
            ],
          },
        ]),
      ),
    })

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

    return this.render(res, prisonerResults, query, errors)
  }

  POST = async (req: Request, res: Response) => {
    const { activeCaseLoadId } = res.locals.user
    const { selectedPrisoner } = req.body
    const query = req.query.query as string
    const prisonerResults = await this.orchestratorService.searchPrisoners(query, activeCaseLoadId)
    await auditPageAction(req, Page.ADD_PRISONER, Action.SEARCH_PRISONER, { query }, SubjectType.SEARCH_TERM)

    const errors = validateForm({ selectedPrisoner }, prisonerResults)
    if (errors) {
      return this.render(res, prisonerResults, query, [errors], selectedPrisoner)
    }

    const prisoner = prisonerResults.find(p => p.prisonerNumber === selectedPrisoner)
    const previousJourney = req.session.registerJourney
    req.session.registerJourney = {
      ...(previousJourney?.prisoner.prisonerNumber === prisoner.prisonerNumber ? previousJourney : {}),
      prisoner,
      searchQuery: query,
    }
    return res.redirect('start-date')
  }
}
