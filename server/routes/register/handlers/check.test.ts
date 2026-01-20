import { Request, Response } from 'express'
import { when } from 'jest-when'
import CheckHandler from './check'
import PrisonerPayService from '../../../services/prisonerPayService'
import * as auditUtils from '../../../utils/auditUtils'
import TestData from '../../../testutils/testData'
import { Action, Page, SubjectType } from '../../../services/auditService'

jest.mock('../../../services/prisonerPayService')
jest.mock('../../../utils/auditUtils')

const prisonerPayService = new PrisonerPayService(null)

describe('CheckHandler', () => {
  let handler: CheckHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    jest.clearAllMocks()
    handler = new CheckHandler(prisonerPayService)
    req = {
      params: { payTypeSlug: 'long-term-sick' },
      session: {
        selectedPrisoner: TestData.Prisoner(),
        selectedDate: '25/01/2025',
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

    jest.mocked(auditUtils.auditPageView).mockResolvedValue(undefined)
    jest.mocked(auditUtils.auditPageAction).mockResolvedValue(undefined)
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/register/check', {
        prisonerName: 'Nicaigh Johnustine',
        prisoner: TestData.Prisoner(),
        selectedDate: '25/01/2025',
      })
    })

    it('should call audit page view with correct parameters', async () => {
      await handler.GET(req as Request, res as Response)

      expect(auditUtils.auditPageView).toHaveBeenCalledWith(
        req,
        Page.CHECK_CONFIRM_PAY,
        {
          payType: 'LONG_TERM_SICK',
          endDate: '25/01/2025',
        },
        SubjectType.PRISONER_ID,
        null,
        TestData.Prisoner().prisonerNumber,
      )
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
          endDate: '2025-01-25',
        }),
      )
    })

    it('should redirect after processing', async () => {
      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalledWith('confirmed-add-prisoner')
    })

    it('should call audit page action with correct parameters', async () => {
      await handler.POST(req as Request, res as Response)

      expect(auditUtils.auditPageAction).toHaveBeenCalledWith(
        req,
        Page.CHECK_CONFIRM_PAY,
        Action.CREATE_STATUS_PERIOD,
        {
          payType: 'LONG_TERM_SICK',
          endDate: '25/01/2025',
        },
        SubjectType.PRISONER_ID,
        TestData.Prisoner().prisonerNumber,
      )
    })
  })
})
