import OrchestratorApiClient from '../data/orchestratorApiClient'

export default class OrchestratorService {
  constructor(private readonly orchestratorApiClient: OrchestratorApiClient) {}

  getPayTypes() {
    return this.orchestratorApiClient.getPayTypes()
  }

  getPaySummaryById(payId: number) {
    return this.orchestratorApiClient.getPaySummaryById(payId)
  }

  getLongTermSick() {
    return this.orchestratorApiClient.getLongTermSick()
  }
}
