import { Request, Response } from 'express'
import { format } from 'date-fns'
import OrchestratorService from '../../../services/orchestratorService'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'
import { auditPageView, getDisplayedPaySummary } from '../../../utils/auditUtils'
import { Page, SubjectType } from '../../../services/auditService'

export default class PayOverviewHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const { activeCaseLoadId } = res.locals.user
    const { payTypeSlug } = req.params
    const payType = getPayTypeBySlug(payTypeSlug)
    const paySummary = (
      await this.orchestratorService.getPayStatusPeriodsByType(format(new Date(), 'yyyy-MM-dd'), activeCaseLoadId)
    ).filter(period => period.type === payType.type)

    await auditPageView(res, Page.PAY_OVERVIEW, getDisplayedPaySummary(paySummary, payType), SubjectType.PRISONER_ID)

    return res.render('pages/dashboard/pay-overview', {
      payType,
      records: paySummary,
    })
  }
}
