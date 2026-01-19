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
    jest.clearAllMocks()
    handler = new ConfirmedAddPrisonerHandler()
    req = {
      params: { payTypeSlug: 'long-term-sick' },
      session: {
        selectedPrisoner: TestData.Prisoner(),
        selectedDate: '2025-01-01',
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
        res,
        Page.CONFIRMED_ADD_DATE,
        {},
        SubjectType.PRISONER_ID,
        null,
        TestData.Prisoner().prisonerNumber,
      )
    })
  })
})
