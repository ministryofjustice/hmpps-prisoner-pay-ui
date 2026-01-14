import { Request, Response } from 'express'
import { format } from 'date-fns'
import OrchestratorService from '../../../services/orchestratorService'
import { getAllPayTypes } from '../../../utils/payTypeUtils'
import AuditService, { Action, Page, SubjectType } from '../../../services/auditService'

export default class DashboardHandler {
  constructor(
    private readonly orchestratorService: OrchestratorService,
    private readonly auditService: AuditService,
  ) {}

  GET = async (req: Request, res: Response) => {
    const { activeCaseLoadId, username } = res.locals.user
    const prisonPopulation = 1000
    const paySummary = await this.orchestratorService.getPayStatusPeriodsByType(
      format(new Date(), 'yyyy-MM-dd'),
      activeCaseLoadId,
    )
    const payTypes = getAllPayTypes().map(payType => {
      return {
        ...payType,
        prisonerCount: paySummary.filter(period => period.type === payType.type).length,
      }
    })

    await this.auditService.logPageView(Page.DASHBOARD, {
      who: username,
      what: Action.VIEW,
      subjectType: SubjectType.NOT_APPLICABLE,
      details: {
        payTypes,
        prisonPopulation,
      },
    })

    return res.render('pages/dashboard/dashboard', {
      prisonPopulation,
      payTypes,
    })
  }
}
