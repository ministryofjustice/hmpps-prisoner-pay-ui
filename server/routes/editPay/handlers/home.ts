import { Request, Response } from 'express'

export default class EditPayHandler {
  GET = async (req: Request, res: Response): Promise<void> => {
    return res.render('pages/editPay/index')
  }
}
