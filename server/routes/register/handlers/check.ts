import { Request, Response } from 'express'
import { format, parse } from 'date-fns'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'
import { formatFirstLastName } from '../../../utils/utils'
import PrisonerPayService from '../../../services/prisonerPayService'
import { CreatePayStatusPeriodRequest } from '../../../@types/prisonerPayAPI/types'

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

    const postRequest: CreatePayStatusPeriodRequest = {
      prisonCode: res.locals.user.activeCaseLoadId,
      prisonerNumber: prisoner.prisonerNumber,
      type: payType.type,
      startDate: format(now, 'yyyy-MM-dd'),
      endDate: selectedDate ? format(parse(selectedDate, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd') : undefined,
    } as CreatePayStatusPeriodRequest

    await this.prisonerPayService.postPayStatusPeriod(postRequest)
    return res.redirect('confirmed-add-prisoner')
  }
}
