import { Request, Response } from 'express'
import OrchestratorService from '../../../services/orchestratorService'
import { formatFirstLastName } from '../../../utils/utils'

export default class EndDateHandler {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  GET = async (req: Request, res: Response) => {
    const prisoner = {
      prisonerNumber: 'G4529UP',
      status: 'ACTIVE IN',
      firstName: 'NICAIGH',
      lastName: 'JOHNUSTINE',
      cellLocation: 'COURT',
    }

    return res.render('pages/register/end-date', {
      prisonerName: formatFirstLastName(prisoner.firstName, prisoner.lastName),
      prisoner,
    })
  }

  POST = async (req: Request, res: Response) => {
    // TODO: Implement POST logic

    return res.redirect('/LTS-check-and-confirm')
  }
}
