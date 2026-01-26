import { Request, Response } from 'express'
import { when } from 'jest-when'
import SetChangeDateHandler from './setChangeDate'
import * as setChangeDateValidation from './setChangeDateValidation'

jest.mock('./setChangeDateValidation')

const mockValidateForm = setChangeDateValidation.default as jest.MockedFunction<typeof setChangeDateValidation.default>

describe('SetChangeDateHandler', () => {
  let handler: SetChangeDateHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new SetChangeDateHandler()
    req = {
      session: {},
      body: {
        changeDateOption: 'tomorrow',
      },
    } as Partial<Request>
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
    }
  })

  describe('GET', () => {
    it('should render the correct view with tomorrow date', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/changePayRate/set-change-date', {
        tomorrow: expect.any(Date),
      })
    })
  })

  describe('POST', () => {
    it('should redirect when validation passes', async () => {
      when(mockValidateForm).calledWith(expect.any(Object)).mockReturnValue(null)

      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalled()
      expect(res.render).not.toHaveBeenCalled()
    })

    it('should call validateForm with correct parameters', async () => {
      when(mockValidateForm).calledWith(expect.any(Object)).mockReturnValue(null)

      await handler.POST(req as Request, res as Response)

      expect(mockValidateForm).toHaveBeenCalledWith({
        changeDateOption: 'tomorrow',
      })
    })

    it('should pass changeDate to validation when provided', async () => {
      req.body = {
        changeDateOption: 'other',
        changeDate: '2026-01-25',
      }
      when(mockValidateForm).calledWith(expect.any(Object)).mockReturnValue(null)

      await handler.POST(req as Request, res as Response)

      expect(mockValidateForm).toHaveBeenCalledWith({
        changeDateOption: 'other',
        changeDate: '2026-01-25',
      })
    })
  })
})
