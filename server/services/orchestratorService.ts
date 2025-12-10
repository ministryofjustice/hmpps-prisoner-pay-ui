import OrchestratorApiClient from '../data/orchestratorApiClient'

export default class OrchestratorService {
  constructor(private readonly orchestratorApiClient: OrchestratorApiClient) {}

  getPaySummaryById(payId: number) {
    return this.orchestratorApiClient.getPaySummaryById(payId)
  }

  getLongTermSick() {
    return this.orchestratorApiClient.getLongTermSick()
  }
}
