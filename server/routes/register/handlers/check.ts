import { Request, Response } from 'express'
import { format, parse } from 'date-fns'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'
import { formatFirstLastName } from '../../../utils/utils'
import PrisonerPayService from '../../../services/prisonerPayService'
import { CreatePayStatusPeriodRequest } from '../../../@types/prisonerPayAPI/types'
import { auditPageAction, auditPageView } from '../../../utils/auditUtils'
import { Action, Page, SubjectType } from '../../../services/auditService'

export default class CheckHandler {
  constructor(private readonly prisonerPayService: PrisonerPayService) {}

  GET = async (req: Request, res: Response) => {
    const prisoner = req.session!.selectedPrisoner
    const { prisonerNumber } = prisoner
    const { selectedDate } = req.session!
    const { type: payType } = getPayTypeBySlug(req.params.payTypeSlug)
    const returnTo = 'check'
    req.session.returnTo = returnTo

    await auditPageView(
      req,
      Page.CHECK_CONFIRM_PAY,
      { payType, endDate: selectedDate },
      SubjectType.PRISONER_ID,
      null,
      prisonerNumber,
    )

    return res.render('pages/register/check', {
      prisonerName: formatFirstLastName(prisoner.firstName, prisoner.lastName),
      prisoner,
      selectedDate,
    })
  }

  POST = async (req: Request, res: Response) => {
    const now = new Date()
    const prisoner = req.session!.selectedPrisoner
    const { prisonerNumber } = prisoner
    const { type: payType } = getPayTypeBySlug(req.params.payTypeSlug)
    const { selectedDate } = req.session!

    const postRequest: CreatePayStatusPeriodRequest = {
      prisonCode: res.locals.user.activeCaseLoadId,
      prisonerNumber,
      type: payType,
      startDate: format(now, 'yyyy-MM-dd'),
      endDate: selectedDate ? format(parse(selectedDate, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd') : undefined,
    } as CreatePayStatusPeriodRequest

    await this.prisonerPayService.postPayStatusPeriod(postRequest)

    await auditPageAction(
      req,
      Page.CHECK_CONFIRM_PAY,
      Action.CREATE_STATUS_PERIOD,
      { payType, endDate: selectedDate },
      SubjectType.PRISONER_ID,
      prisonerNumber,
    )
    return res.redirect('confirmed-add-prisoner')
  }
}
