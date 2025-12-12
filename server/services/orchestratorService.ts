import OrchestratorApiClient from '../data/orchestratorApiClient'

export default class OrchestratorService {
  constructor(private readonly orchestratorApiClient: OrchestratorApiClient) {}

  getPayTypes() {
    return this.orchestratorApiClient.getPayTypes()
  }

  getPaySummaryByType(searchType: string) {
    return this.orchestratorApiClient.getPaySummaryByType(searchType)
  }

  getLongTermSick() {
    return this.orchestratorApiClient.getLongTermSick()
  }
}
