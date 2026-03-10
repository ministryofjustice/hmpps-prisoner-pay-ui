import { format, parse } from 'date-fns'
import { Request, Response } from 'express'
import PrisonerPayService from '../../../services/prisonerPayService'
import { Action, Page, SubjectType } from '../../../services/auditService'
import { auditPageAction } from '../../../utils/auditUtils'

export default class CheckPayRateHandler {
  constructor(private readonly prisonerPayService: PrisonerPayService) {}

  GET = async (req: Request, res: Response) => {
    const { payAmount, selectedDate } = req.session!
    return res.render('pages/changePayRate/check-pay-rate', {
      payAmount,
      selectedDate: parse(selectedDate, 'dd/MM/yyyy', new Date()),
    })
  }

  POST = async (req: Request, res: Response) => {
    const { selectedDate, payRateId } = req.session!
    const { payType } = res.locals
    const parsedDate = parse(selectedDate, 'dd/MM/yyyy', new Date())
    const { payAmount } = req.session!
    // TODO: Add util earlier in journey to calculate this so api can work in decimals but UI can display in £ and p

    await this.prisonerPayService.patchPayRate(payRateId, {
      startDate: format(parsedDate, 'yyyy-MM-dd'),
      rate: parseFloat(payAmount),
    })

    await auditPageAction(
      req,
      Page.CHECK_CONFIRM_PAY,
      Action.EDIT_PAY_RATE,
      {
        payType: payType.type,
        payAmount,
        effectiveDate: format(parsedDate, 'yyyy-MM-dd'),
      },
      SubjectType.NOT_APPLICABLE,
    )

    const successMessage = `You've updated the pay for ${payType.description}. The change will take effect from ${format(parsedDate, 'd MMMM yyyy')}.`
    return res.redirectWithSuccess('../../pay-rates', 'Pay rate updated', successMessage)
  }
}
