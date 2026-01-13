import { Request, Response } from 'express'
import { format } from 'date-fns'
import OrchestratorService from '../../../services/orchestratorService'
import { getAllPayTypes, getPayTypeBySlug } from '../../../utils/payTypeUtils'

export default class DashboardHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const { activeCaseLoadId } = res.locals.user
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

    return res.render('pages/dashboard/dashboard', {
      prisonPopulation,
      payTypes,
    })
  }
}
