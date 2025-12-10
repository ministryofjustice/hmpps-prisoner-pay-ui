import nock from 'nock'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import OrchestratorApiClient from './orchestratorApiClient'
import config from '../config'

describe('OrchestratorApiClient', () => {
  let orchestratorApiClient: OrchestratorApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>

    orchestratorApiClient = new OrchestratorApiClient(mockAuthenticationClient)
  })

  afterEach(() => {
    nock.cleanAll()
    jest.resetAllMocks()
  })

  describe('getLongTermSick', () => {
    it('should make a GET request to /example/long-term-sick using system token and return the response body', async () => {
      nock(config.apis.exampleApi.url)
        .get('/example/long-term-sick')
        .matchHeader('authorization', 'Bearer test-system-token')
        .reply(200)

      const response = await orchestratorApiClient.getLongTermSick()

      expect(response).toEqual([
        {
          prisonerNumber: 'AB1234C',
          prisonerName: 'Aconcaga, Bryony',
          cellLocation: 'A-1-100',
          status: 'LTS',
          startDate: '2025-04-10',
          endDate: null,
        },
        {
          prisonerNumber: 'CD6253D',
          prisonerName: 'Denali, Frances',
          cellLocation: 'B-2-056',
          status: 'LTS',
          startDate: '2025-03-01',
          endDate: null,
        },
        {
          prisonerNumber: 'AH8374B',
          prisonerName: 'Elbrus, Veronica',
          cellLocation: 'A-2-007',
          status: 'LTS',
          startDate: '2025-08-01',
          endDate: '2025-01-03',
        },
      ])
    })
  })
})
