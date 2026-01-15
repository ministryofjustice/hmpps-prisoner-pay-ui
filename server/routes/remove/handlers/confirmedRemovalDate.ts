import { Request, Response } from 'express'
import { format, isToday, parse } from 'date-fns'
import OrchestratorService from '../../../services/orchestratorService'

export default class ConfirmedRemovalDateHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const selectedDate = parse(req.session!.selectedDate, 'dd/MM/yyyy', new Date())
    const formattedDate = format(selectedDate, 'EEEE, d MMMM yyyy')
    const { payStatusId } = req.params
    const payStatusPeriod = await this.orchestratorService.getPayStatusPeriodById(payStatusId)

    return res.render('pages/remove/confirmed-removal-date', {
      payStatusPeriod,
      selectedDate: isToday(selectedDate) ? 'today' : formattedDate,
    })
  }
}
