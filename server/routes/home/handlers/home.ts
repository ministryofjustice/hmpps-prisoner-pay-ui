import { Request, Response } from 'express'

export default class HomeRoutes {
  GET = async (req: Request, res: Response): Promise<void> => {
    return res.render('pages/home/index')
  }
}
