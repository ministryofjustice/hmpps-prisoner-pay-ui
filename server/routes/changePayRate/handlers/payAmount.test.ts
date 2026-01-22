import { Request, Response } from 'express'
import { when } from 'jest-when'
import PayAmountHandler from './payAmount'
import validateForm from './payAmountValidation'
import TestData from '../../../testutils/testData'

jest.mock('./payAmountValidation')

describe('PayAmountHandler', () => {
  let handler: PayAmountHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new PayAmountHandler()
    req = {
      body: {
        payAmount: '1.00',
      },
      session: {},
    } as Partial<Request>
    res = {
      locals: {
        payType: {
          dailyPayAmount: 0.65,
          description: 'Long-term sick',
        },
        user: TestData.PrisonUser(),
      },
      render: jest.fn(),
      redirect: jest.fn(),
    }
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/changePayRate/pay-amount', {})
    })
  })

  describe('POST', () => {
    it('should redirect when validation passes', async () => {
      when(validateForm).calledWith(expect.any(Object), expect.any(Number), expect.any(String)).mockReturnValue(null)

      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalled()
      expect(res.render).not.toHaveBeenCalled()
    })

    it('should render with error when validation fails', async () => {
      const mockError = {
        href: '#payAmount',
        text: 'Long-term sick pay cannot be less than £0.65 per day',
      }
      when(validateForm)
        .calledWith(expect.any(Object), expect.any(Number), expect.any(String))
        .mockReturnValue(mockError)

      await handler.POST(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/changePayRate/pay-amount', {
        errors: [mockError],
        payAmount: '1.00',
      })
      expect(res.redirect).not.toHaveBeenCalled()
    })
  })
})
