import { Request, Response } from 'express'
import OrchestratorService from '../../../services/orchestratorService'
import { formatFirstLastName } from '../../../utils/utils'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'
import validateForm from './endDateValidation'

export default class EndDateHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const payType = getPayTypeBySlug(req.params.payTypeSlug)
    const prisoner = req.session!.selectedPrisoner

    return res.render('pages/register/end-date', {
      prisonerName: formatFirstLastName(prisoner.firstName, prisoner.lastName),
      prisoner,
      payType,
    })
  }

  POST = async (req: Request, res: Response) => {
    const { endDate, endDateSelection } = req.body
    req.session.endDate = endDate

    const errors = validateForm(endDateSelection)
    if (errors) return res.render('pages/register/end-date', { errors: [errors], endDateSelection })

    return res.redirect('check')
  }
}
