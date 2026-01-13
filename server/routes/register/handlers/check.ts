import { Request, Response } from 'express'
import { format } from 'date-fns'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'
import { formatFirstLastName } from '../../../utils/utils'
import PrisonerPayService from '../../../services/prisonerPayService'
import { CreatePayStatusPeriodRequest } from '../../../@types/prisonerPayAPI/types'
import AuditService, { Action, Page, SubjectType } from '../../../services/auditService'

export default class CheckHandler {
  constructor(
    private readonly prisonerPayService: PrisonerPayService,
    private readonly auditService: AuditService,
  ) {}

  GET = async (req: Request, res: Response) => {
    const { username } = res.locals.user
    const prisoner = req.session!.selectedPrisoner
    const { selectedDate } = req.session!
    const payType = getPayTypeBySlug(req.params.payTypeSlug)

    await this.auditService.logPageView(Page.CHECK_PAGE, {
      who: username,
      what: Action.VIEW_CHECK_PAY_STATUS_PERIOD,
      subjectType: SubjectType.NOT_APPLICABLE,
      details: {
        prisonerNumber: prisoner.prisonerNumber,
        payType,
        endDate: selectedDate,
      },
    })

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
      endDate: selectedDate ? format(new Date(selectedDate), 'yyyy-MM-dd') : undefined,
    } as CreatePayStatusPeriodRequest

    await this.prisonerPayService.postPayStatusPeriod(postRequest)
    return res.redirect('confirmed-add-prisoner')
  }
}
