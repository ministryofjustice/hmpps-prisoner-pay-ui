import { Request, Response } from 'express'

export default class ConfirmedAddPrisonerHandler {
  constructor() {}

  GET = async (req: Request, res: Response) => {
    const prisoner = req.session!.selectedPrisoner
    const { selectedDate } = req.session!

    return res.render('pages/register/confirmed-add-prisoner', {
      prisoner,
      selectedDate,
    })
  }
}
