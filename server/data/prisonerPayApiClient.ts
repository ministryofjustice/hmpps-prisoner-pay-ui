/* eslint-disable @typescript-eslint/no-unused-vars */
import { asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import { CreatePayStatusPeriodRequest, UpdatePayStatusPeriodRequest } from '../@types/prisonerPayAPI/types'
import config from '../config'
import logger from '../../logger'
import { PayStatusPeriod } from '../@types/payOrchestratorAPI/types'

export default class PrisonerPayApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('prisoner pay API', config.apis.prisonerPayApi, logger, authenticationClient)
  }

  patchPayStatusPeriod(payStatusId: string, request: UpdatePayStatusPeriodRequest) {
    return {}
  }

  async postPayStatusPeriod(request: CreatePayStatusPeriodRequest): Promise<PayStatusPeriod> {
    return this.post<PayStatusPeriod>(
      {
        path: '/pay-status-periods',
        data: request,
      },
      asSystem(),
    )
  }
}
