import { Request, Response } from 'express'
import { format } from 'date-fns'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'
import { formatFirstLastName } from '../../../utils/utils'
import PrisonerPayService from '../../../services/prisonerPayService'

export default class CheckHandler {
  constructor(private readonly prisonerPayService: PrisonerPayService) {}

  GET = async (req: Request, res: Response) => {
    const prisoner = req.session!.selectedPrisoner
    const { selectedDate } = req.session!

    return res.render('pages/register/check', {
      prisonerName: formatFirstLastName(prisoner.firstName, prisoner.lastName),
      prisoner,
      selectedDate,
    })
  }

  POST = async (req: Request, res: Response) => {
    const now = new Date()
    const prisoner = req.session!.selectedPrisoner
    const payType = getPayTypeBySlug(req.params.payTypeSlug)
    const { selectedDate } = req.session!

    await this.prisonerPayService.postPayStatusPeriod({
      prisonerNumber: prisoner.prisonerNumber,
      type: payType.type,
      startDate: format(now, 'yyyy-MM-dd'),
      endDate: selectedDate,
    })

    return res.redirect('confirmed-add-prisoner')
  }
}
