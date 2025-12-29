import { Request, Response } from 'express'
import CheckHandler from './check'
import TestData from '../../../testutils/testData'
import PayType from '../../../@types/payTypes'

describe('CheckHandler', () => {
  let handler: CheckHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new CheckHandler()
    req = {
      params: { payTypeSlug: 'long-term-sick' },
      session: {
        selectedPrisoner: TestData.Prisoner(),
        endDate: '2025-01-01',
      },
    } as unknown as Partial<Request>
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
    }
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/register/check', {
        prisonerName: 'Nicaigh Johnustine',
        prisoner: TestData.Prisoner(),
        payType: {
          type: PayType.LONG_TERM_SICK,
          description: 'Long-term sick',
          slug: 'long-term-sick',
        },
        endDate: '2025-01-01',
      })
    })
  })

  describe('POST', () => {
    it('should redirect after processing', async () => {
      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalled()
    })
  })
})
