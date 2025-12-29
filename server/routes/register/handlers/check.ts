import { Request, Response } from 'express'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'
import { formatFirstLastName } from '../../../utils/utils'

export default class CheckHandler {
  constructor() {}

  GET = async (req: Request, res: Response) => {
    const payType = getPayTypeBySlug(req.params.payTypeSlug)
    const prisoner = req.session!.selectedPrisoner
    const { endDate } = req.session!

    return res.render('pages/register/check', {
      prisonerName: formatFirstLastName(prisoner.firstName, prisoner.lastName),
      prisoner,
      payType,
      endDate,
    })
  }

  POST = async (req: Request, res: Response) => {
    // TODO: Implement POST logic
    return res.redirect('')
  }
}
