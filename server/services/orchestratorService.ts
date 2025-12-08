import OrchestratorApiClient from '../data/orchestratorApiClient'

export default class OrchestratorService {
  constructor(private readonly orchestratorApiClient: OrchestratorApiClient) {}

  getLongTermSick() {
    return this.orchestratorApiClient.getLongTermSick()
  }
}
