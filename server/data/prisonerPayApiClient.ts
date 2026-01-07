/* eslint-disable @typescript-eslint/no-unused-vars */
import { RestClient } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import { CreatePayStatusPeriodRequest, UpdatePayStatusPeriodRequest } from '../@types/prisonerPayAPI/types'
import config from '../config'
import logger from '../../logger'

export default class PrisonerPayApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('prisoner pay API', config.apis.prisonerPayApi, logger, authenticationClient)
  }

  patchPayStatusPeriod(payStatusId: string, request: UpdatePayStatusPeriodRequest) {
    return {}
  }

  postPayStatusPeriod(request: CreatePayStatusPeriodRequest) {
    return {}
  }
}
