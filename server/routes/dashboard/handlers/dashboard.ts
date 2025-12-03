import { Request, Response } from 'express'

export default class DashboardHandler {
  constructor() {}

  GET = async (req: Request, res: Response) => {
    const prisonPopulation = 1200
    const payTypes = [
      {
        key: 'LTS',
        name: 'Long term sick',
        prisonerCount: 12,
        url: '/add/long-term-sick',
      },
    ]
    return res.render('pages/dashboard/dashboard', {
      prisonPopulation,
      payTypes,
    })
  }
}
