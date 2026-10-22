import { Request, Response } from 'express'
import { format, isToday, parse } from 'date-fns'
import config from '../../../config'
import OrchestratorService from '../../../services/orchestratorService'
import { auditPageView } from '../../../utils/auditUtils'
import { Page, SubjectType } from '../../../services/auditService'
import { formatFirstLastName, getSingleParam } from '../../../utils/utils'

export default class ConfirmedRemovalDateHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const selectedDate = parse(req.session!.selectedDate, 'dd/MM/yyyy', new Date())
    const formattedDate = format(selectedDate, 'EEEE, d MMMM yyyy')
    const payStatusId = getSingleParam(req.params.payStatusId)
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

    const prisonerName = formatFirstLastName(payStatusPeriod.firstName, payStatusPeriod.lastName)
    const dateText = isToday(selectedDate) ? 'today' : formattedDate
    const payTypeDescription = res.locals.payType.description.toLowerCase()

    return res.render('pages/remove/confirmed-removal-date', {
      confirmation: {
        titleText: 'Removal complete',
        text: `${prisonerName} (${prisonerNumber}) will not receive ${payTypeDescription} pay after ${dateText}.`,
        nextSteps: [
          {
            text: `allocate ${prisonerName} to activities`,
            href: `${config.activitiesUiUrl}/prisoner-allocations/${prisonerNumber}`,
          },
          { text: `review people who are on ${payTypeDescription}`, href: '../../pay-overview' },
        ],
      },
    })
  }
}
