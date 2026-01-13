import { Request, Response } from 'express'
import { format } from 'date-fns'
import OrchestratorService from '../../../services/orchestratorService'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'
import AuditService, { Action, Page, SubjectType } from '../../../services/auditService'

export default class PayOverviewHandler {
  constructor(
    private readonly orchestratorService: OrchestratorService,
    private readonly auditService: AuditService,
  ) {}

  GET = async (req: Request, res: Response) => {
    const { activeCaseLoadId, username } = res.locals.user
    const { payTypeSlug } = req.params
    const payType = getPayTypeBySlug(payTypeSlug)
    const paySummary = (
      await this.orchestratorService.getPayStatusPeriodsByType(format(new Date(), 'yyyy-MM-dd'), activeCaseLoadId)
    ).filter(period => period.type === payType.type)

    await this.auditService.logPageView(Page.PAY_OVERVIEW, {
      who: username,
      what: Action.VIEW,
      subjectType: SubjectType.NOT_APPLICABLE,
      details: {
        payType,
        paySummaries: paySummary.map(record => ({
          prisonerNumber: record.prisonerNumber,
          cellLocation: record.cellLocation,
          startDate: record.startDate,
          endDate: record.endDate,
        })),
      },
    })
    return res.render('pages/dashboard/pay-overview', {
      payType,
      records: paySummary,
    })
  }
}
