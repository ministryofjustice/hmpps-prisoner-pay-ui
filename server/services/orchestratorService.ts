import OrchestratorApiClient from '../data/orchestratorApiClient'

export default class OrchestratorService {
  constructor(private readonly orchestratorApiClient: OrchestratorApiClient) {}

  getPayStatusPeriodsByType(payType: string) {
    return this.orchestratorApiClient.getPayStatusPeriods().filter(period => period.type === payType)
  }

  getPayStatusPeriodById(payStatusId: string) {
    return this.orchestratorApiClient.getPayStatusPeriodById(payStatusId)
  }

  getPrisonerByPrisonerNumber(prisonerNumber: string) {
    return this.orchestratorApiClient.getPrisonerByPrisonerNumber(prisonerNumber)
  }

  searchPrisoners(query: string) {
    return this.orchestratorApiClient.searchPrisoners(query)
  }

  getPayTypes() {
    return this.orchestratorApiClient.getPayTypes()
  }

  getLongTermSick() {
    return this.orchestratorApiClient.getLongTermSick()
  }
}
