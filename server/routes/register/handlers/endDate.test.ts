import { Request, Response } from 'express'
import { format } from 'date-fns'
import EndDateHandler from './endDate'
import OrchestratorService from '../../../services/orchestratorService'
import TestData from '../../../testutils/testData'

jest.mock('../../../services/orchestratorService')

const orchestratorService = new OrchestratorService(null)

describe('EndDateHandler', () => {
  let handler: EndDateHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new EndDateHandler(orchestratorService)
    req = {
      body: {},
      params: { payTypeSlug: 'long-term-sick' },
      session: {
        selectedPrisoner: TestData.Prisoner(),
      },
    } as unknown as Request
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
    }
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/register/end-date', {
        prisonerName: 'Nicaigh Johnustine',
        prisoner: TestData.Prisoner(),
      })
    })
  })

  describe('POST', () => {
    it('should redirect after processing with no date', async () => {
      req.body = {
        selectedDate: '',
        endDateSelection: 'no',
      }
      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalled()
    })

    it('should redirect after processing with date', async () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 1)
      const formattedDate = format(futureDate, 'dd/MM/yyyy')
      req.body = {
        selectedDate: formattedDate,
        endDateSelection: 'yes',
      }
      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalled()
    })
  })
})
