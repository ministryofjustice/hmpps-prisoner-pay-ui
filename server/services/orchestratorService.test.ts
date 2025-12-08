import OrchestratorApiClient from '../data/orchestratorApiClient'
import OrchestratorService from './orchestratorService'

jest.mock('../data/orchestratorApiClient')

describe('OrchestratorService', () => {
  const orchestratorApiClientApi = new OrchestratorApiClient(null) as jest.Mocked<OrchestratorApiClient>
  let orchestratorService: OrchestratorService

  beforeEach(() => {
    jest.clearAllMocks()
    orchestratorApiClientApi.getLongTermSick = jest.fn()
    orchestratorService = new OrchestratorService(orchestratorApiClientApi)
  })

  it('should call getLongTermSick on the api client', async () => {
    await orchestratorService.getLongTermSick()
    expect(orchestratorApiClientApi.getLongTermSick).toHaveBeenCalledTimes(1)
  })
})
