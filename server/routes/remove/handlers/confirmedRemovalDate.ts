import { Request, Response } from 'express'
import { format, isToday, parse } from 'date-fns'
import OrchestratorService from '../../../services/orchestratorService'
import { auditPageView } from '../../../utils/auditUtils'
import { Page, SubjectType } from '../../../services/auditService'

export default class ConfirmedRemovalDateHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const selectedDate = parse(req.session!.selectedDate, 'dd/MM/yyyy', new Date())
    const formattedDate = format(selectedDate, 'EEEE, d MMMM yyyy')
    const { payStatusId } = req.params
    const payStatusPeriod = await this.orchestratorService.getPayStatusPeriodById(payStatusId)
    const { endDate, type, prisonerNumber } = payStatusPeriod

    await auditPageView(
      req,
      Page.CONFIRMED_REMOVE_DATE,
      { endDate, type },
      SubjectType.PRISONER_ID,
      null,
      prisonerNumber,
    )

    return res.render('pages/remove/confirmed-removal-date', {
      payStatusPeriod,
      selectedDate: isToday(selectedDate) ? 'today' : formattedDate,
    })
  }
}
