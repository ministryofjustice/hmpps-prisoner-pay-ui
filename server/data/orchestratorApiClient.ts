/* eslint-disable @typescript-eslint/no-unused-vars */
import { asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import TestData from '../testutils/testData'
import { PayStatusPeriod, Prisoner } from '../@types/payOrchestratorAPI/types'

export default class OrchestratorApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('orchestrator API', config.apis.payOrchestratorApi, logger, authenticationClient)
  }

  async getPayStatusPeriods(latestStartDate: string, prisonCode: string): Promise<PayStatusPeriod[]> {
    return this.get<PayStatusPeriod[]>(
      {
        path: '/pay-status-periods',
        query: {
          latestStartDate,
          prisonCode,
        },
      },
      asSystem(),
    )
  }

  async getPayStatusPeriodById(payStatusId: string): Promise<PayStatusPeriod> {
    return this.get<PayStatusPeriod>(
      {
        path: `/pay-status-periods/${payStatusId}`,
      },
      asSystem(),
    )
  }

  async searchPrisoners(query: string, prisonCode: string) {
    return this.get<Prisoner[]>(
      {
        path: `/prison/${prisonCode}/candidate-search`,
        query: {
          searchTerm: query,
        },
      },
      asSystem(),
    )
  }

  async getPayRates() {
    return [TestData.PayRate()]
  }

  async getPayRateByType(type: string) {
    return TestData.PayRate()
  }

  async getPayRateById(id: string) {
    return TestData.PayRate()
  }
}
