import { Request, Response } from 'express'
import { format } from 'date-fns'
import LastDayHandler from './lastDay'
import * as auditUtils from '../../../../utils/auditUtils'
import TestData from '../../../../testutils/testData'
import { Page, SubjectType } from '../../../../services/auditService'

jest.mock('../../../../utils/auditUtils')

describe('LastDayHandler', () => {
  let handler: LastDayHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-01-20T12:00:00Z'))
    jest.clearAllMocks()
    handler = new LastDayHandler()
    req = {
      body: {},
      params: { payTypeSlug: 'long-term-sick' },
      session: {
        registerJourney: {
          prisoner: TestData.Prisoner(),
          startDate: '2025-01-01',
          endDateSelection: 'yes',
        },
      },
    } as unknown as Request
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

      expect(res.render).toHaveBeenCalledWith('pages/register/last-day', {
        prisonerName: 'Nicaigh Johnustine',
        prisoner: TestData.Prisoner(),
        selectedDate: undefined,
      })
    })

    it('should call audit page view with correct parameters', async () => {
      await handler.GET(req as Request, res as Response)

      expect(auditUtils.auditPageView).toHaveBeenCalledWith(
        req,
        Page.SET_END_DATE,
        {},
        SubjectType.PRISONER_ID,
        null,
        TestData.Prisoner().prisonerNumber,
      )
    })
  })

  it.each(['GET', 'POST'] as const)('requires a yes selection for %s', async method => {
    req.session.registerJourney.endDateSelection = 'no'
    await handler[method](req as Request, res as Response)
    expect(res.redirect).toHaveBeenCalledWith('end-date')
  })

  describe('POST', () => {
    it('should redirect after processing with date', async () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 1)
      const formattedDate = format(futureDate, 'dd/MM/yyyy')
      req.body = {
        selectedDate: formattedDate,
      }
      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalledWith('check')
    })
  })
  it('restores the chosen end date on back navigation', async () => {
    req.session.registerJourney.endDate = '2026-01-25'
    req.session.registerJourney.endDateSelection = 'yes'
    await handler.GET(req as Request, res as Response)
    expect(res.render).toHaveBeenCalledWith(
      'pages/register/last-day',
      expect.objectContaining({ selectedDate: '25/01/2026' }),
    )
  })
  it('stores a submitted picker date as ISO and restores it for redisplay', async () => {
    req.body = { endDateSelection: 'yes', selectedDate: '25/01/2026' }
    await handler.POST(req as Request, res as Response)
    expect(req.session.registerJourney.endDate).toBe('2026-01-25')
    await handler.GET(req as Request, res as Response)
    expect(res.render).toHaveBeenCalledWith(
      'pages/register/last-day',
      expect.objectContaining({
        selectedDate: '25/01/2026',
      }),
    )
  })

  it('preserves an invalid picker entry without changing the saved ISO date', async () => {
    req.session.registerJourney.endDate = '2026-01-25'
    req.body = { endDateSelection: 'yes', selectedDate: '31/02/2026' }
    await handler.POST(req as Request, res as Response)
    expect(req.session.registerJourney.endDate).toBe('2026-01-25')
    expect(res.render).toHaveBeenCalledWith(
      'pages/register/last-day',
      expect.objectContaining({
        selectedDate: '31/02/2026',
        errors: [{ href: '#selectedDate', text: 'Enter a real date' }],
      }),
    )
    expect(res.redirect).not.toHaveBeenCalled()
  })
})
