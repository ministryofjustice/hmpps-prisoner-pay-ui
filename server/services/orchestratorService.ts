import { PayStatusPeriod } from '../@types/payOrchestratorAPI/types'
import OrchestratorApiClient from '../data/orchestratorApiClient'

export default class OrchestratorService {
  constructor(private readonly orchestratorApiClient: OrchestratorApiClient) {}

  async getPayStatusPeriodsByType(latestStartDate: string, prisonCode: string): Promise<PayStatusPeriod[]> {
    return this.orchestratorApiClient.getPayStatusPeriods(latestStartDate, prisonCode)
  }

  async getPayStatusPeriodById(payStatusId: string): Promise<PayStatusPeriod> {
    return this.orchestratorApiClient.getPayStatusPeriodById(payStatusId)
  }

  async searchPrisoners(query: string, prisonCode: string) {
    return this.orchestratorApiClient.searchPrisoners(query, prisonCode)
  }

  async getPayRates() {
    return this.orchestratorApiClient.getPayRates()
  }

  async getPayRateByType(type: string) {
    return this.orchestratorApiClient.getPayRateByType(type)
  }
}
