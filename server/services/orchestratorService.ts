import { ServiceUser } from '../@types/express'
import { PayStatusPeriod } from '../@types/payOrchestratorAPI/types'
import OrchestratorApiClient from '../data/orchestratorApiClient'

export default class OrchestratorService {
  constructor(private readonly orchestratorApiClient: OrchestratorApiClient) {}

  getPayStatusPeriodsByType(latestStartDate: string, prisonCode: string): Promise<PayStatusPeriod[]> {
    return this.orchestratorApiClient.getPayStatusPeriods(latestStartDate, prisonCode)
  }

  getPayStatusPeriodById(payStatusId: string): PayStatusPeriod {
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
