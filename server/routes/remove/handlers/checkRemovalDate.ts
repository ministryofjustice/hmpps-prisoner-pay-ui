import { Request, Response } from 'express'
import { parse, format, isToday } from 'date-fns'
import OrchestratorService from '../../../services/orchestratorService'
import PrisonerPayService from '../../../services/prisonerPayService'
import AuditService, { Action, Page, SubjectType } from '../../../services/auditService'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'

export default class CheckRemovalDateHandler {
  constructor(
    private readonly orchestratorService: OrchestratorService,
    private readonly prisonerPayService: PrisonerPayService,
    private readonly auditService: AuditService,
  ) {}

  GET = async (req: Request, res: Response) => {
    const { username } = res.locals.user
    const selectedDate = parse(req.session!.selectedDate, 'dd/MM/yyyy', new Date())
    const formattedDate = format(selectedDate, 'EEEE, d MMMM yyyy')
    const { payStatusId } = req.params
    const payStatusPeriod = await this.orchestratorService.getPayStatusPeriodById(payStatusId)
    const payType = getPayTypeBySlug(req.params.payTypeSlug)

    await this.auditService.logPageView(Page.CHECK_PAGE, {
      what: Action.DELETE_PAY_STATUS_PERIOD,
      who: username,
      subjectType: SubjectType.NOT_APPLICABLE,
      details: {
        payType,
        prisonerNumber: payStatusPeriod.prisonerNumber,
        selectedDate,
      },
    })

    return res.render('pages/remove/check-removal-date', {
      payStatusPeriod,
      selectedDate: isToday(selectedDate) ? `Today - ${formattedDate}` : formattedDate,
    })
  }

  POST = async (req: Request, res: Response) => {
    const { payStatusId } = req.params
    const selectedDate = parse(req.session!.selectedDate, 'dd/MM/yyyy', new Date())

    await this.prisonerPayService.patchPayStatusPeriod(payStatusId, {
      endDate: format(selectedDate, 'yyyy-MM-dd'),
      removeEndDate: false,
    })

    return res.redirect('confirmed-removal-date')
  }
}
