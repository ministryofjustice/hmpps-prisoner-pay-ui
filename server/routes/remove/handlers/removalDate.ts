import { Request, Response } from 'express'
import { format } from 'date-fns'
import OrchestratorService from '../../../services/orchestratorService'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'
import validateForm from './removalDateValidation'
import { auditPageView } from '../../../utils/auditUtils'
import { Page, SubjectType } from '../../../services/auditService'
import { getSingleParam } from '../../../utils/utils'

export default class RemovalDateHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const payStatusId = getSingleParam(req.params.payStatusId)
    const payStatusPeriod = await this.orchestratorService.getPayStatusPeriodById(payStatusId)
    const { prisonerNumber, type, firstName, lastName } = payStatusPeriod
    req.session.selectedPrisoner = { prisonerNumber, firstName, lastName }
    const returnTo = 'removal-date'
    req.session.returnTo = returnTo

    await auditPageView(
      req,
      Page.SET_REMOVAL_DATE,
      { prisonerNumber, type },
      SubjectType.PRISONER_ID,
      null,
      prisonerNumber,
    )

    return res.render('pages/remove/removal-date', {
      payStatusPeriod,
    })
  }

  POST = async (req: Request, res: Response) => {
    const { removalDateOption, removalDate } = req.body

    const errors = validateForm({ removalDateOption, removalDate })
    if (errors) {
      const payStatusId = getSingleParam(req.params.payStatusId)
      const payStatusPeriod = await this.orchestratorService.getPayStatusPeriodById(payStatusId)
      const payType = getPayTypeBySlug(getSingleParam(req.params.payTypeSlug))
      return res.render('pages/remove/removal-date', {
        payStatusPeriod,
        payType,
        errors: [errors],
        removalDateOption,
        removalDate,
      })
    }

    req.session!.selectedDate = removalDateOption === 'today' ? format(new Date(), 'dd/MM/yyyy') : removalDate
    return res.redirect('./check-removal-date')
  }
}
