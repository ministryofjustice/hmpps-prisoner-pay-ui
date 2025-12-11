import { Request, Response } from 'express'

export default class AddPrisonerHandler {
  constructor() {}

  GET = async (req: Request, res: Response) => {
    return res.render('pages/register/add-prisoner', {})
  }

  POST = async (req: Request, res: Response) => {
    // TODO: Implement POST logic
    return res.redirect('')
  }
}
