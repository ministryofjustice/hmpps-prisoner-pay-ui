import { addDays } from 'date-fns'
import { Request, Response } from 'express'
import validateForm from './setChangeDateValidation'

export default class SetChangeDateHandler {
  constructor() {}

  GET = async (req: Request, res: Response) => {
    const tomorrow = addDays(new Date(), 1)
    return res.render('pages/changePayRate/set-change-date', { tomorrow })
  }

  POST = async (req: Request, res: Response) => {
    const { changeDateOption, changeDate } = req.body

    const errors = validateForm({ changeDateOption, changeDate })

    if (errors) {
      const tomorrow = addDays(new Date(), 1)
      return res.render('pages/changePayRate/set-change-date', {
        errors: [errors],
        tomorrow,
        changeDateOption,
        changeDate,
      })
    }

    // TODO: Implement POST logic
    return res.redirect('')
  }
}
