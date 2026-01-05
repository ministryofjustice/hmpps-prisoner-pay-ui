import { Request, Response, NextFunction } from 'express'
import { when } from 'jest-when'
import setPayType from './setPayType'
import { getPayTypeBySlug } from '../utils/payTypeUtils'
import PayType from '../@types/payTypes'

jest.mock('../utils/payTypeUtils')

const mockPayType = {
  type: PayType.LONG_TERM_SICK,
  description: 'Long-term sick',
  slug: 'long-term-sick',
  dailyPayAmount: 65,
}

describe('setPayType middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    jest.clearAllMocks()
    req = {
      params: { payTypeSlug: 'long-term-sick' },
    } as unknown as Request
    res = {
      locals: {},
    } as unknown as Response
    next = jest.fn()

    when(getPayTypeBySlug).calledWith('long-term-sick').mockReturnValue(mockPayType)
  })

  it('should set payType in res.locals when payTypeSlug is present', () => {
    setPayType(req as Request, res as Response, next)

    expect(getPayTypeBySlug).toHaveBeenCalledWith('long-term-sick')
    expect(res.locals.payType).toEqual({
      type: 'LONG_TERM_SICK',
      description: 'Long-term sick',
      slug: 'long-term-sick',
      dailyPayAmount: 65,
    })
  })

  it('should call next', () => {
    setPayType(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
  })

  it('should not set payType when payTypeSlug is not present', () => {
    req.params = {}

    setPayType(req as Request, res as Response, next)

    expect(res.locals.payType).toBeUndefined()
    expect(next).toHaveBeenCalled()
  })

  it('should not call getPayTypeBySlug when payTypeSlug is not present', () => {
    req.params = {}

    setPayType(req as Request, res as Response, next)

    expect(getPayTypeBySlug).not.toHaveBeenCalled()
  })
})
