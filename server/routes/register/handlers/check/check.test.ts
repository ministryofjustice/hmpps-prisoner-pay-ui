import { Request, Response } from 'express'
import { when } from 'jest-when'
import CheckHandler from './check'
import PrisonerPayService from '../../../../services/prisonerPayService'
import * as auditUtils from '../../../../utils/auditUtils'
import TestData from '../../../../testutils/testData'
import { Action, Page, SubjectType } from '../../../../services/auditService'

jest.mock('../../../../services/prisonerPayService')
jest.mock('../../../../utils/auditUtils')

const prisonerPayService = new PrisonerPayService(null)

describe('CheckHandler', () => {
  let handler: CheckHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2025-01-23T12:00:00Z'))
    jest.clearAllMocks()
    handler = new CheckHandler(prisonerPayService)
    req = {
      params: { payTypeSlug: 'long-term-sick' },
      session: {
        registerJourney: {
          prisoner: TestData.Prisoner(),
          endDate: '2025-01-25',
          startDate: '2025-01-24',
          endDateSelection: 'yes',
        },
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

  afterEach(() => jest.useRealTimers())

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/register/check', {
        prisonerName: 'Nicaigh Johnustine',
        prisoner: TestData.Prisoner(),
        endDateText: '25 January 2025',
        startDateText: 'Tomorrow - 24 January 2025',
      })
    })

    it('should call audit page view with correct parameters', async () => {
      await handler.GET(req as Request, res as Response)

      expect(auditUtils.auditPageView).toHaveBeenCalledWith(
        req,
        Page.CHECK_CONFIRM_PAY,
        {
          payType: 'LONG_TERM_SICK',
          endDate: '2025-01-25',
          startDate: '2025-01-24',
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
          startDate: '2025-01-24',
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
          endDate: '2025-01-25',
          startDate: '2025-01-24',
        },
        SubjectType.PRISONER_ID,
        TestData.Prisoner().prisonerNumber,
      )
    })
  })
  it.each(['GET', 'POST'] as const)('returns to start date when it is missing on %s', async method => {
    delete req.session.registerJourney.startDate
    await handler[method](req as Request, res as Response)
    expect(res.redirect).toHaveBeenCalledWith('start-date')
    expect(prisonerPayService.postPayStatusPeriod).not.toHaveBeenCalled()
  })
  it.each(['GET', 'POST'] as const)('rechecks the date range on %s after start date changes', async method => {
    req.session.registerJourney.startDate = '2025-01-26'
    await handler[method](req as Request, res as Response)
    expect(res.redirect).toHaveBeenCalledWith('end-date')
    expect(prisonerPayService.postPayStatusPeriod).not.toHaveBeenCalled()
  })
  it('renders check answers when no end date was selected', async () => {
    req.session.registerJourney.endDateSelection = 'no'
    delete req.session.registerJourney.endDate
    await handler.GET(req as Request, res as Response)
    expect(res.render).toHaveBeenCalledWith(
      'pages/register/check',
      expect.objectContaining({ startDateText: 'Tomorrow - 24 January 2025', endDateText: 'None set' }),
    )
  })

  it('submits without an end date when no end date was selected', async () => {
    req.session.registerJourney.endDateSelection = 'no'
    delete req.session.registerJourney.endDate
    await handler.POST(req as Request, res as Response)
    expect(prisonerPayService.postPayStatusPeriod).toHaveBeenCalledWith(
      expect.objectContaining({ startDate: '2025-01-24', endDate: undefined }),
    )
    expect(res.redirect).toHaveBeenCalledWith('confirmed-add-prisoner')
  })
  it('clears the draft after saving and retains only confirmation details', async () => {
    req.session.returnTo = '/authentication-return'
    await handler.POST(req as Request, res as Response)
    expect(req.session.registerJourney).toBeUndefined()
    expect(req.session.registerConfirmation).toEqual({
      prisoner: TestData.Prisoner(),
      startDate: '2025-01-24',
      endDate: '2025-01-25',
    })
    expect(req.session.returnTo).toBe('/authentication-return')
    jest.mocked(prisonerPayService.postPayStatusPeriod).mockClear()
    await handler.POST(req as Request, res as Response)
    expect(prisonerPayService.postPayStatusPeriod).not.toHaveBeenCalled()
  })

  it('keeps the draft when the API fails', async () => {
    const draft = { ...req.session.registerJourney }
    jest.mocked(prisonerPayService.postPayStatusPeriod).mockRejectedValueOnce(new Error('API unavailable'))
    await expect(handler.POST(req as Request, res as Response)).rejects.toThrow('API unavailable')
    expect(req.session.registerJourney).toEqual(draft)
    expect(req.session.registerConfirmation).toBeUndefined()
  })

  it('does not overwrite authentication navigation when showing check answers', async () => {
    req.session.returnTo = '/authentication-return'
    await handler.GET(req as Request, res as Response)
    expect(req.session.returnTo).toBe('/authentication-return')
    expect(req.session.registerJourney.returnTo).toBe('check')
  })
  it.each([
    ['2025-01-23', 'Today - 23 January 2025'],
    ['2025-01-24', 'Tomorrow - 24 January 2025'],
    ['2025-01-25', '25 January 2025'],
  ])('formats both summary dates for %s using the saved date', async (date, text) => {
    req.session.registerJourney.startDate = date
    req.session.registerJourney.endDate = date
    req.session.registerJourney.startDateOption = 'other'
    await handler.GET(req as Request, res as Response)
    expect(res.render).toHaveBeenCalledWith(
      'pages/register/check',
      expect.objectContaining({
        startDateText: text,
        endDateText: text,
      }),
    )
    expect(req.session.registerJourney.startDate).toBe(date)
    expect(req.session.registerJourney.endDate).toBe(date)
  })
})
