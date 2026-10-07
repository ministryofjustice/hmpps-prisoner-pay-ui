import { Request, Response } from 'express'
import EndDateHandler from './endDate'
import * as auditUtils from '../../../../utils/auditUtils'
import TestData from '../../../../testutils/testData'
import { Page, SubjectType } from '../../../../services/auditService'

jest.mock('../../../../utils/auditUtils')

describe('EndDateHandler', () => {
  let handler: EndDateHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    jest.clearAllMocks()
    handler = new EndDateHandler()
    req = {
      body: {},
      params: { payTypeSlug: 'long-term-sick' },
      session: {
        registerJourney: {
          prisoner: TestData.Prisoner(),
          startDate: '2025-01-01',
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

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/register/end-date', {
        prisonerName: 'Nicaigh Johnustine',
        prisoner: TestData.Prisoner(),
        endDateSelection: undefined,
      })
    })

    it('should call audit page view with correct parameters', async () => {
      await handler.GET(req as Request, res as Response)

      expect(auditUtils.auditPageView).toHaveBeenCalledWith(
        req,
        Page.SET_END_DATE_SELECTION,
        {},
        SubjectType.PRISONER_ID,
        null,
        TestData.Prisoner().prisonerNumber,
      )
    })
  })

  describe('POST', () => {
    it('should redirect after processing with no date', async () => {
      req.body = {
        selectedDate: '',
        endDateSelection: 'no',
      }
      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalledWith('check')
    })

    it('opens the date screen when yes is selected', async () => {
      req.body = { endDateSelection: 'yes' }
      await handler.POST(req as Request, res as Response)
      expect(req.session.registerJourney.endDateSelection).toBe('yes')
      expect(res.redirect).toHaveBeenCalledWith('last-day')
    })

    it.each([undefined, '', 'invalid'])('requires a valid choice: %s', async endDateSelection => {
      req.body = { endDateSelection }
      await handler.POST(req as Request, res as Response)
      expect(res.render).toHaveBeenCalledWith(
        'pages/register/end-date',
        expect.objectContaining({
          errors: [{ href: '#endDateSelection', text: 'Select if you want to set their last day or not' }],
        }),
      )
      expect(res.redirect).not.toHaveBeenCalled()
    })
  })

  it('clears an earlier end date when no is selected', async () => {
    req.session.registerJourney.endDate = '2026-01-25'
    req.body = { endDateSelection: 'no', selectedDate: '25/01/2026' }
    await handler.POST(req as Request, res as Response)
    expect(req.session.registerJourney.endDate).toBeUndefined()
    expect(req.session.registerJourney.endDateSelection).toBe('no')
  })
  it('restores the chosen end date on back navigation', async () => {
    req.session.registerJourney.endDate = '2026-01-25'
    req.session.registerJourney.endDateSelection = 'yes'
    await handler.GET(req as Request, res as Response)
    expect(res.render).toHaveBeenCalledWith(
      'pages/register/end-date',
      expect.objectContaining({ endDateSelection: 'yes' }),
    )
  })
})
