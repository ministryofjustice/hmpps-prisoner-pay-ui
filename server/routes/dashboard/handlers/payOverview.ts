import { Request, Response } from 'express'
import OrchestratorService from '../../../services/orchestratorService'

export default class PayOverviewHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const { payId } = req.params
    const payTypes = [
      {
        id: 1,
        code: 'LTS',
        description: 'Long-term Sick',
        dailyPayAmount: 65,
      },
    ]
    const longTermSickRecord = this.orchestratorService.getLongTermSick()
    return res.render('pages/dashboard/pay-overview', {
      payType: payTypes.find(pt => pt.id === Number(payId)),
      records: longTermSickRecord,
    })
  }

  POST = async (req: Request, res: Response) => {
    // TODO: Implement POST logic
    return res.redirect('')
  }
}
