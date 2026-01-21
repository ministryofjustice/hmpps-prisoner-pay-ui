import { NextFunction, Request, Response } from 'express'
import * as dpsComponents from '@ministryofjustice/hmpps-connect-dps-components'
import { getCachedDpsComponents, dpsComponentsMiddleware } from './setUpDpsComponents'
import TestData from '../testutils/testData'

jest.mock('@ministryofjustice/hmpps-connect-dps-components')

describe('setUpDpsComponents', () => {
  let req: Request
  let res: Response
  let next: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    req = {
      method: 'GET',
      session: {},
    } as unknown as Request
    res = {
      locals: {
        user: TestData.PrisonUser(),
      },
    } as Response
    next = jest.fn()
  })

  it('should access cached components on non GET requests and NOT call API', () => {
    req.method = 'POST'

    const cachedComponents = {
      header: '<header>testHeader</header>',
      footer: '<footer>testFooter</footer>',
      cssIncludes: [] as string[],
      jsIncludes: [] as string[],
    }

    const reqWithSession = req as Request & { session: { feComponents?: Record<string, unknown> } }
    reqWithSession.session.feComponents = cachedComponents

    const cachedDpsComponents = getCachedDpsComponents()
    cachedDpsComponents(req, res, next)

    expect(res.locals.feComponents).toEqual(cachedComponents)
    expect(dpsComponents.getFrontendComponents).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })

  it('should NOT access cached components on GET requests and SHOULD call API', () => {
    req.method = 'GET'

    const cachedComponents = {
      header: '<header>testHeader</header>',
      footer: '<footer>testFooter</footer>',
      cssIncludes: [] as string[],
      jsIncludes: [] as string[],
    }

    const componentsMock = dpsComponents.getFrontendComponents as jest.Mock
    componentsMock.mockReturnValue((mockReq: Request, mockRes: Response, mockNext: NextFunction) => {
      mockNext()
    })

    const reqWithSession = req as Request & { session: { feComponents?: typeof cachedComponents } }
    reqWithSession.session.feComponents = cachedComponents

    const cachedDpsComponents = getCachedDpsComponents()
    cachedDpsComponents(req, res, () => {})

    const componentsMiddleware = dpsComponentsMiddleware()
    componentsMiddleware(req, res, next)

    expect(dpsComponents.getFrontendComponents).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalled()
  })
})
