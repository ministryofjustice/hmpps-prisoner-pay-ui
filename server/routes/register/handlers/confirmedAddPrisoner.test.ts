import { Request, Response } from 'express'
import ConfirmedAddPrisonerHandler from './confirmedAddPrisoner'
import TestData from '../../../testutils/testData'

describe('ConfirmedAddPrisonerHandler', () => {
  let handler: ConfirmedAddPrisonerHandler
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
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
    }
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
  })
})
