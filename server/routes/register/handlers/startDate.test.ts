import { Request, Response } from 'express'
import StartDateHandler from './startDate'
import TestData from '../../../testutils/testData'
import { auditPageView } from '../../../utils/auditUtils'
import { Page, SubjectType } from '../../../services/auditService'

jest.mock('../../../utils/auditUtils')

describe('StartDateHandler', () => {
  let req: Request
  let res: Response
  const handler = new StartDateHandler()
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-01-07T12:00:00Z'))
    jest.clearAllMocks()
    req = {
      body: {},
      session: { registerJourney: { prisoner: TestData.Prisoner(), searchQuery: 'John' } },
    } as unknown as Request
    res = { render: jest.fn(), redirect: jest.fn() } as unknown as Response
  })
  afterEach(() => jest.useRealTimers())

  it('renders dates and audits the page', async () => {
    await handler.GET(req, res)
    expect(res.render).toHaveBeenCalledWith(
      'pages/register/start-date',
      expect.objectContaining({
        prisonerName: 'Nicaigh Johnustine',
        today: '7 January 2026',
        tomorrow: '8 January 2026',
        searchQuery: 'John',
      }),
    )
    expect(auditPageView).toHaveBeenCalledWith(
      req,
      Page.SET_START_DATE,
      {},
      SubjectType.PRISONER_ID,
      null,
      TestData.Prisoner().prisonerNumber,
    )
    expect(req.session.registerJourney.returnTo).toBe('start-date')
  })
  it.each([
    ['today', '2026-01-07'],
    ['tomorrow', '2026-01-08'],
    ['other', '2026-01-20'],
  ])('stores %s as a concrete date', async (option, date) => {
    req.body = { startDateOption: option, startDate: '20/01/2026' }
    await handler.POST(req, res)
    expect(req.session.registerJourney.startDate).toBe(date)
    expect(req.session.registerJourney.startDateOption).toBe(option)
    expect(res.redirect).toHaveBeenCalledWith('end-date')
    await handler.GET(req, res)
    expect(res.render).toHaveBeenLastCalledWith(
      'pages/register/start-date',
      expect.objectContaining({ startDateOption: option }),
    )
  })

  it('restores custom date fields on back navigation', async () => {
    req.session.registerJourney.startDate = '2026-02-20'
    req.session.registerJourney.startDateOption = 'other'
    await handler.GET(req, res)
    expect(res.render).toHaveBeenCalledWith(
      'pages/register/start-date',
      expect.objectContaining({ startDateOption: 'other', startDate: '20/02/2026' }),
    )
  })

  it('preserves invalid fields instead of replacing them with the stored date', async () => {
    req.session.registerJourney.startDate = '2026-02-20'
    req.body = { startDateOption: 'other', startDate: '31/02/2026' }
    await handler.POST(req, res)
    expect(res.render).toHaveBeenCalledWith(
      'pages/register/start-date',
      expect.objectContaining({
        startDateOption: 'other',
        startDate: '31/02/2026',
        errors: [{ href: '#startDate', text: 'Enter a real start date' }],
      }),
    )
    expect(req.session.registerJourney.startDate).toBe('2026-02-20')
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('resolves tomorrow across a year boundary', async () => {
    jest.setSystemTime(new Date('2026-12-31T12:00:00Z'))
    req.body = { startDateOption: 'tomorrow' }
    await handler.POST(req, res)
    expect(req.session.registerJourney.startDate).toBe('2027-01-01')
  })

  it.each([
    ['07/01/2026', '2026-01-07'],
    ['08/01/2026', '2026-01-08'],
  ])('accepts %s from the date picker', async (input, expected) => {
    req.body = { startDateOption: 'other', startDate: input }
    await handler.POST(req, res)
    expect(req.session.registerJourney.startDate).toBe(expected)
    expect(req.session.registerJourney.startDateOption).toBe('other')
    expect(res.redirect).toHaveBeenCalledWith('end-date')
  })
})
