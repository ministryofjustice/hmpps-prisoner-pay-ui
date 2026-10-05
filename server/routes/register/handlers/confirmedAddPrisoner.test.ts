import { Request, Response } from 'express'
import ConfirmedAddPrisonerHandler from './confirmedAddPrisoner'
import * as auditUtils from '../../../utils/auditUtils'
import TestData from '../../../testutils/testData'
import { Page, SubjectType } from '../../../services/auditService'

jest.mock('../../../utils/auditUtils')

describe('ConfirmedAddPrisonerHandler', () => {
  let handler: ConfirmedAddPrisonerHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-01-07T12:00:00Z'))
    jest.clearAllMocks()
    handler = new ConfirmedAddPrisonerHandler()
    req = {
      params: { payTypeSlug: 'long-term-sick' },
      session: {
        registerConfirmation: {
          prisoner: TestData.Prisoner(),
          endDate: '2025-01-01',
          startDate: '2026-01-07',
        },
      },
    } as unknown as Partial<Request>
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      locals: {
        user: TestData.PrisonUser(),
      },
    }

    jest.mocked(auditUtils.auditPageView).mockResolvedValue(undefined)
  })

  afterEach(() => jest.useRealTimers())

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith(
        'pages/register/confirmed-add-prisoner',
        expect.objectContaining({
          prisoner: TestData.Prisoner(),
          selectedDate: '2025-01-01',
        }),
      )
    })

    it('should call audit page view with correct parameters', async () => {
      await handler.GET(req as Request, res as Response)

      expect(auditUtils.auditPageView).toHaveBeenCalledWith(
        req,
        Page.CONFIRMED_ADD_DATE,
        {},
        SubjectType.PRISONER_ID,
        null,
        TestData.Prisoner().prisonerNumber,
      )
    })
  })
  it('can refresh the confirmation without changing session state', async () => {
    const before = JSON.stringify(req.session)
    await handler.GET(req as Request, res as Response)
    await handler.GET(req as Request, res as Response)
    expect(JSON.stringify(req.session)).toBe(before)
    expect(res.render).toHaveBeenCalledTimes(2)
  })

  it('returns to search if there is no saved confirmation', async () => {
    delete req.session.registerConfirmation
    await handler.GET(req as Request, res as Response)
    expect(res.redirect).toHaveBeenCalledWith('add-prisoner')
  })
  it.each([
    ['2026-01-07', 'today'],
    ['2026-01-08', '8 January 2026'],
    ['2026-12-24', '24 December 2026'],
  ])('uses the resolved start date %s in the confirmation', async (startDate, startDateText) => {
    req.session.registerConfirmation.startDate = startDate
    await handler.GET(req as Request, res as Response)
    expect(res.render).toHaveBeenCalledWith(
      'pages/register/confirmed-add-prisoner',
      expect.objectContaining({
        prisonerName: 'Nicaigh Johnustine',
        startDateText,
      }),
    )
  })
})
