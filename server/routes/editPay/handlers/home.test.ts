import { Request, Response } from 'express'
import EditPayHandler from './home'
import TestData from '../../../testutils/testData'

describe('GET /Edit pay homepage', () => {
  const handler = new EditPayHandler()
  let req: Request
  let res: Response

  beforeEach(() => {
    res = {
      locals: {
        user: TestData.PrisonUser(),
      },
      render: jest.fn(),
    } as unknown as Response
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render edit pay homepage', async () => {
    await handler.GET(req, res)
    expect(res.render).toHaveBeenCalledWith('pages/editPay/home')
  })
})
