import { Request, Response } from 'express'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'

export default class ConfirmedAddPrisonerHandler {
  constructor() {}

  GET = async (req: Request, res: Response) => {
    const payType = getPayTypeBySlug(req.params.payTypeSlug)
    const prisoner = req.session!.selectedPrisoner
    const { endDate } = req.session!

    return res.render('pages/register/confirmed-add-prisoner', {
      prisoner,
      payType,
      endDate,
    })
  }
}
