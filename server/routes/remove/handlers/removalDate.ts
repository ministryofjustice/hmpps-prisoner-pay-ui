import { Request, Response } from 'express'
import { format } from 'date-fns'
import { FormError } from '../../../@types/template'
import OrchestratorService from '../../../services/orchestratorService'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'
import validateForm from './removalDateValidation'
import { auditPageView } from '../../../utils/auditUtils'
import { Page, SubjectType } from '../../../services/auditService'
import { findError, formatFirstLastName, getSingleParam } from '../../../utils/utils'

export default class RemovalDateHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  private render = (
    req: Request,
    res: Response,
    payStatusPeriod: Awaited<ReturnType<OrchestratorService['getPayStatusPeriodById']>>,
    removalDateOption?: string,
    removalDate?: string,
    errors: FormError[] = [],
  ) => {
    const payType = getPayTypeBySlug(getSingleParam(req.params.payTypeSlug))
    const prisonerName = formatFirstLastName(payStatusPeriod.firstName, payStatusPeriod.lastName)
    return res.render('pages/remove/removal-date', {
      payStatusPeriod,
      payType,
      removalDateOption,
      removalDate,
      errors,
      radios: {
        name: 'removalDateOption',
        classes: 'govuk-radios',
        legend: `When do you want to remove ${prisonerName} from ${payType.description}?`,
        value: removalDateOption,
        errorMessage: findError(errors, 'removalDateOption'),
        items: [
          { value: 'today', text: `Today - ${format(new Date(), 'EEEE, d MMMM yyyy')}` },
          {
            value: 'other',
            text: 'A different date',
            datePicker: {
              id: 'removalDate',
              name: 'removalDate',
              label: { text: 'Input the removal date', classes: 'govuk-visually-hidden' },
              value: removalDate,
              errorMessage: findError(errors, 'removalDate'),
            },
          },
        ],
      },
    })
  }

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

    return this.render(req, res, payStatusPeriod)
  }

  POST = async (req: Request, res: Response) => {
    const { removalDateOption, removalDate } = req.body

    const errors = validateForm({ removalDateOption, removalDate })
    if (errors) {
      const payStatusId = getSingleParam(req.params.payStatusId)
      const payStatusPeriod = await this.orchestratorService.getPayStatusPeriodById(payStatusId)
      return this.render(req, res, payStatusPeriod, removalDateOption, removalDate, [errors])
    }

    req.session!.selectedDate = removalDateOption === 'today' ? format(new Date(), 'dd/MM/yyyy') : removalDate
    return res.redirect('./check-removal-date')
  }
}
