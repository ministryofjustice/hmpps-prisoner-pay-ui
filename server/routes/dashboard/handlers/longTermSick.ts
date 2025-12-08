import { Request, Response } from 'express'
import OrchestratorService from '../../../services/orchestratorService'

export default class LongTermSickHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const longTermSickRecord = this.orchestratorService.getLongTermSick()

    return res.render('pages/dashboard/long-term-sick', {
      longTermSickRecord,
    })
  }

  POST = async (req: Request, res: Response) => {
    // TODO: Implement POST logic
    return res.redirect('')
  }
}
