import { Request, Response } from 'express'

export default class PayOverviewHandler {
  constructor() {}

  GET = async (req: Request, res: Response) => {
    return res.render('pages/dashboard/pay-overview', {})
  }

  POST = async (req: Request, res: Response) => {
    // TODO: Implement POST logic
    return res.redirect('')
  }
}
