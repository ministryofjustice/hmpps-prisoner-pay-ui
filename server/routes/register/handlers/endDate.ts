import { Request, Response } from 'express'
import OrchestratorService from '../../../services/orchestratorService'
import { formatFirstLastName } from '../../../utils/utils'
import validateForm from './endDateValidation'

export default class EndDateHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const prisoner = req.session!.selectedPrisoner

    return res.render('pages/register/end-date', {
      prisonerName: formatFirstLastName(prisoner.firstName, prisoner.lastName),
      prisoner,
    })
  }

  POST = async (req: Request, res: Response) => {
    const { selectedDate, endDateSelection } = req.body
    req.session.selectedDate = selectedDate

    const errors = validateForm(endDateSelection)
    if (errors) return res.render('pages/register/end-date', { errors: [errors], endDateSelection })

    return res.redirect('check')
  }
}
