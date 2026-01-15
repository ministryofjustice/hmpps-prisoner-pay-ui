import { Request, Response } from 'express'
import { when } from 'jest-when'
import CheckRemovalDateHandler from './checkRemovalDate'
import OrchestratorService from '../../../services/orchestratorService'
import PrisonerPayService from '../../../services/prisonerPayService'
import AuditService from '../../../services/auditService'
import TestData from '../../../testutils/testData'

jest.mock('../../../services/orchestratorService')
jest.mock('../../../services/prisonerPayService')
jest.mock('../../../services/auditService')

const orchestratorService = new OrchestratorService(null)
const prisonerPayService = new PrisonerPayService(null)
const auditService = new AuditService(null)

describe('CheckRemovalDateHandler', () => {
  let handler: CheckRemovalDateHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    handler = new CheckRemovalDateHandler(orchestratorService, prisonerPayService, auditService)
    req = {
      params: { payStatusId: '123', payTypeSlug: 'long-term-sick' },
      session: { selectedDate: '25/12/2025' },
    } as unknown as Request
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      locals: {
        user: TestData.PrisonUser(),
      },
    }

    when(orchestratorService.getPayStatusPeriodById).calledWith('123').mockResolvedValue(TestData.PayStatusPeriod())
    when(prisonerPayService.patchPayStatusPeriod)
      .calledWith('123', expect.any(Object))
      .mockResolvedValue(TestData.PayStatusPeriod())
  })

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response)

      expect(res.render).toHaveBeenCalledWith(
        'pages/remove/check-removal-date',
        expect.objectContaining({
          payStatusPeriod: TestData.PayStatusPeriod(),
          selectedDate: expect.any(String),
        }),
      )
    })
  })

  describe('POST', () => {
    it('should redirect after processing', async () => {
      await handler.POST(req as Request, res as Response)

      expect(res.redirect).toHaveBeenCalled()
    })
  })
})
