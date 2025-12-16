import OrchestratorApiClient from '../data/orchestratorApiClient'

export default class OrchestratorService {
  constructor(private readonly orchestratorApiClient: OrchestratorApiClient) {}

  getPrisonerByPrisonerNumber(prisonerNumber: string) {
    return this.orchestratorApiClient.getPrisonerByPrisonerNumber(prisonerNumber)
  }

  searchPrisoners(query: string) {
    return this.orchestratorApiClient.searchPrisoners(query)
  }

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
