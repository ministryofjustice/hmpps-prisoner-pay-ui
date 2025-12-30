/* eslint-disable @typescript-eslint/no-unused-vars */
import { RestClient } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'

export default class PrisonerPayApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('prisoner pay API', config.apis.exampleApi, logger, authenticationClient)
  }

  patchPayStatusPeriod(payStatusId: string, body: Record<string, unknown>) {
    return {}
  }

  postPayStatusPeriod(body: Record<string, unknown>) {
    return {}
  }
}
