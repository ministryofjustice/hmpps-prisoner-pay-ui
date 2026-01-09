import { Request, Response } from 'express'
import { when } from 'jest-when'
import CheckHandler from './check'
import PrisonerPayService from '../../../services/prisonerPayService'
import TestData from '../../../testutils/testData'

jest.mock('../../../services/prisonerPayService')

const prisonerPayService = new PrisonerPayService(null)

describe('CheckHandler', () => {
  let handler: CheckHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new CheckHandler(prisonerPayService)
    req = {
      params: { payTypeSlug: 'long-term-sick' },
      session: {
        selectedPrisoner: TestData.Prisoner(),
        selectedDate: '2025-01-01',
      },
    } as unknown as Partial<Request>
    res = {
      locals: {
        user: TestData.PrisonUser(),
      },
      render: jest.fn(),
      redirect: jest.fn(),
    }

    when(prisonerPayService.postPayStatusPeriod)
      .calledWith(expect.any(Object))
      .mockResolvedValue(TestData.PayStatusPeriod())
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/register/check', {
        prisonerName: 'Nicaigh Johnustine',
        prisoner: TestData.Prisoner(),
        selectedDate: '2025-01-01',
      })
    })
  })

  describe('POST', () => {
    it('should call postPayStatusPeriod with correct parameters', async () => {
      await handler.POST(req as Request, res as Response)

      expect(prisonerPayService.postPayStatusPeriod).toHaveBeenCalledWith(
        expect.objectContaining({
          prisonerNumber: TestData.Prisoner().prisonerNumber,
          type: 'LONG_TERM_SICK',
          startDate: expect.any(String),
          endDate: '2025-01-01',
        }),
      )
    })

    it('should redirect after processing', async () => {
      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalledWith('confirmed-add-prisoner')
    })
  })
})
