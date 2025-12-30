import { Request, Response } from 'express'
import { when } from 'jest-when'
import RemovalDateHandler from './removalDate'
import OrchestratorService from '../../../services/orchestratorService'
import TestData from '../../../testutils/testData'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'

jest.mock('../../../services/orchestratorService')

const orchestratorService = new OrchestratorService(null)

describe('RemovalDateHandler', () => {
  let handler: RemovalDateHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new RemovalDateHandler(orchestratorService)
    req = {
      params: { payStatusId: '123', payTypeSlug: 'long-term-sick' },
      body: {},
      session: {},
    } as unknown as Request
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
    }

    when(orchestratorService.getPayStatusPeriodById).calledWith('123').mockReturnValue(TestData.PayStatusPeriod())
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/remove/removal-date', {
        payStatusPeriod: TestData.PayStatusPeriod(),
      })
    })
  })

  describe('POST', () => {
    it('should redirect after with valid today option', async () => {
      req.body = { removalDateOption: 'today' }

      await handler.POST(req as Request, res as Response)

      expect(req.session!.selectedDate).toBeDefined()
      expect(res.redirect).toHaveBeenCalledWith('./check-removal-date')
    })

    it('should redirect after processing with valid other option', async () => {
      req.body = { removalDateOption: 'other', removalDate: '25/12/2025' }

      await handler.POST(req as Request, res as Response)

      expect(req.session!.selectedDate).toBe('25/12/2025')
      expect(res.redirect).toHaveBeenCalledWith('./check-removal-date')
    })

    it('should render form with error when removalDateOption is missing', async () => {
      req.body = { removalDateOption: '' }

      await handler.POST(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith(
        'pages/remove/removal-date',
        expect.objectContaining({
          payStatusPeriod: TestData.PayStatusPeriod(),
          payType: getPayTypeBySlug('long-term-sick'),
          errors: expect.arrayContaining([
            expect.objectContaining({
              href: '#removalDateOption',
              text: 'Select a removal date option',
            }),
          ]),
        }),
      )
      expect(res.redirect).not.toHaveBeenCalled()
    })

    it('should render form with error when removalDateOption is other but removalDate is missing', async () => {
      req.body = { removalDateOption: 'other', removalDate: '' }

      await handler.POST(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith(
        'pages/remove/removal-date',
        expect.objectContaining({
          payStatusPeriod: TestData.PayStatusPeriod(),
          payType: getPayTypeBySlug('long-term-sick'),
          errors: expect.arrayContaining([
            expect.objectContaining({
              href: '#removalDate',
              text: 'Enter a removal date',
            }),
          ]),
        }),
      )
      expect(res.redirect).not.toHaveBeenCalled()
    })
  })
})
