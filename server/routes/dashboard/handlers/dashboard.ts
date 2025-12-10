import { Request, Response } from 'express'
import OrchestratorService from '../../../services/orchestratorService'

export default class DashboardHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const payTypes = this.orchestratorService.getPayTypes()
    const prisonPopulation = 1200

    return res.render('pages/dashboard/dashboard', {
      prisonPopulation,
      payTypes,
    })
  }
}
