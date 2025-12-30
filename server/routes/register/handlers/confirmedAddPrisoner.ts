import { Request, Response } from 'express'

export default class ConfirmedAddPrisonerHandler {
  constructor() {}

  GET = async (req: Request, res: Response) => {
    return res.render('pages/register/confirmed-add-prisoner', {})
  }

  POST = async (req: Request, res: Response) => {
    // TODO: Implement POST logic
    return res.redirect('')
  }
}
