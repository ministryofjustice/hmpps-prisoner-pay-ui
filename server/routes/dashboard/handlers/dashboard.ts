import { Request, Response } from 'express'
import OrchestratorService from '../../../services/orchestratorService'
import { getAllPayTypes } from '../../../utils/payTypeUtils'
import { auditPageView } from '../../../utils/auditUtils'
import { Page } from '../../../services/auditService'

export default class DashboardHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const { activeCaseLoadId } = res.locals.user
    const prisonPopulation = 1000
    const paySummary = await this.orchestratorService.getUnendedPayStatusPeriods(activeCaseLoadId)
    const payTypes = getAllPayTypes().map(payType => {
      return {
        ...payType,
        prisonerCount: paySummary.filter(period => period.type === payType.type).length,
      }
    })
    await auditPageView(req, Page.DASHBOARD, { payTypes, prisonPopulation })

    return res.render('pages/dashboard/dashboard', {
      prisonPopulation,
      payTypes,
    })
  }
}
