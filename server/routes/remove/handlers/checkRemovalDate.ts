import { Request, Response } from 'express'
import { parse, format, isToday } from 'date-fns'
import OrchestratorService from '../../../services/orchestratorService'
import PrisonerPayService from '../../../services/prisonerPayService'
import { auditPageAction, auditPageView } from '../../../utils/auditUtils'
import { Action, Page, SubjectType } from '../../../services/auditService'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'

export default class CheckRemovalDateHandler {
  constructor(
    private readonly orchestratorService: OrchestratorService,
    private readonly prisonerPayService: PrisonerPayService,
  ) {}

  GET = async (req: Request, res: Response) => {
    const selectedDate = parse(req.session!.selectedDate, 'dd/MM/yyyy', new Date())
    const formattedDate = format(selectedDate, 'EEEE, d MMMM yyyy')
    const { payStatusId } = req.params
    const payStatusPeriod = await this.orchestratorService.getPayStatusPeriodById(payStatusId)
    const { prisonerNumber } = payStatusPeriod
    const { type: payType } = getPayTypeBySlug(req.params.payTypeSlug)
    const returnTo = 'check-removal-date'
    req.session.returnTo = returnTo

    await auditPageView(
      req,
      Page.CHECK_REMOVE_PAY,
      { payType, selectedDate },
      SubjectType.PRISONER_ID,
      null,
      prisonerNumber,
    )

    return res.render('pages/remove/check-removal-date', {
      payStatusPeriod,
      selectedDate: isToday(selectedDate) ? `Today - ${formattedDate}` : formattedDate,
    })
  }

  POST = async (req: Request, res: Response) => {
    const { payStatusId } = req.params
    const selectedDate = parse(req.session!.selectedDate, 'dd/MM/yyyy', new Date())
    const { type: payType } = getPayTypeBySlug(req.params.payTypeSlug)

    await this.prisonerPayService.patchPayStatusPeriod(payStatusId, {
      endDate: format(selectedDate, 'yyyy-MM-dd'),
      removeEndDate: false,
    })

    await auditPageAction(req, Page.CHECK_REMOVE_PAY, Action.EDIT_STATUS_PERIOD, { payType, payStatusId, selectedDate })

    return res.redirect('confirmed-removal-date')
  }
}
