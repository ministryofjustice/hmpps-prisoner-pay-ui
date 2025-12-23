import { Request, Response } from 'express'
import EndDateHandler from './endDate'
import OrchestratorService from '../../../services/orchestratorService'
import PayType from '../../../@types/payTypes'
import TestData from '../../../testutils/testData'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'

jest.mock('../../../services/orchestratorService')

const orchestratorService = new OrchestratorService(null)

describe('EndDateHandler', () => {
  let handler: EndDateHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new EndDateHandler(orchestratorService)
    req = {
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
        payType: getPayTypeBySlug('long-term-sick'),
      })
    })
  })

  describe('POST', () => {
    it('should redirect after processing', async () => {
      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalled()
    })
  })

  // TODO: Add more test cases
})
