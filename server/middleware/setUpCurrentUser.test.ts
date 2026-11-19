import express from 'express'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { telemetryMiddleware, trace } from '@ministryofjustice/hmpps-azure-telemetry'
import setUpCurrentUser from './setUpCurrentUser'
import TestData from '../testutils/testData'

jest.mock('@azure/monitor-opentelemetry-exporter', () => ({}))

describe('setUpCurrentUser telemetry', () => {
  const setAttribute = jest.fn()

  beforeEach(() => {
    setAttribute.mockReset()
    jest
      .spyOn(trace, 'getActiveSpan')
      .mockReturnValue({ setAttribute } as unknown as ReturnType<typeof trace.getActiveSpan>)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it.each([
    { userUuid: '11111111-1111-1111-1111-111111111111', expectedUuid: '11111111-1111-1111-1111-111111111111' },
    { userUuid: undefined, expectedUuid: undefined },
  ])('adds available user metadata to the active span: $userUuid', async ({ userUuid, expectedUuid }) => {
    const token = jwt.sign(
      { name: 'TEST USER', user_id: '12345', user_uuid: userUuid, authorities: ['ROLE_PRISONER_PAY'] },
      'secret',
    )
    const app = express()
    app.use((req, res, next) => {
      res.locals.user = { ...TestData.PrisonUser(), token }
      next()
    })
    app.use(setUpCurrentUser())
    app.use(telemetryMiddleware.addUserMetadataToTelemetry())
    app.get('/', (req, res) => res.json(res.locals.user))

    const response = await request(app).get('/').expect(200)

    expect(response.body).toMatchObject({ userId: '12345', staffId: 12345, displayName: 'Test User' })
    expect(response.body.userUuid).toBe(expectedUuid)
    expect(setAttribute).toHaveBeenCalledWith('userId', '12345')
    expect(setAttribute).toHaveBeenCalledWith('activeCaseLoadId', 'MDI')
    if (expectedUuid) {
      expect(setAttribute).toHaveBeenCalledWith('userUuid', expectedUuid)
    } else {
      expect(setAttribute).not.toHaveBeenCalledWith('userUuid', expect.anything())
    }
  })
})
