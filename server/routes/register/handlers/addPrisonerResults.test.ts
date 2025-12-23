import { Request, Response } from 'express'
import { when } from 'jest-when'
import AddPrisonerResultsHandler from './addPrisonerResults'
import OrchestratorService from '../../../services/orchestratorService'
import TestData from '../../../testutils/testData'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'

jest.mock('../../../services/orchestratorService')

const orchestratorService = new OrchestratorService(null)

describe('AddPrisonerResultsHandler', () => {
  let handler: AddPrisonerResultsHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new AddPrisonerResultsHandler(orchestratorService)
    req = {
      params: { payTypeSlug: 'long-term-sick' },
      query: {
        query: 'test',
      },
      body: {
        prisonerNumber: 'A1234BC',
      },
      session: {},
    } as unknown as Partial<Request>

    res = {
      render: jest.fn(),
      redirect: jest.fn(),
    }

    when(orchestratorService.searchPrisoners)
      .calledWith('test')
      .mockReturnValue({ ...TestData.Pagination(), content: TestData.Prisoners() })
    when(orchestratorService.getPrisonerByPrisonerNumber)
      .calledWith('A1234BC')
      .mockReturnValue({ ...TestData.Prisoner(), allocations: [] })
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith('pages/register/add-prisoner-results', {
        prisoners: TestData.Prisoners(),
        query: 'test',
        payType: getPayTypeBySlug('long-term-sick'),
      })
    })
  })

  describe('POST', () => {
    it('should redirect after processing', async () => {
      await handler.POST(req as Request, res as Response)
      expect(req.session!.selectedPrisoner).toStrictEqual({ ...TestData.Prisoner(), allocations: [] })
      expect(res.redirect).toHaveBeenCalledWith('end-date')
    })
  })
})
