import { AuthenticationClient, InMemoryTokenStore, RedisTokenStore } from '@ministryofjustice/hmpps-auth-clients'

import applicationInfoSupplier from '../applicationInfo'
import config from '../config'
import logger from '../../logger'
import { createRedisClient } from './redisClient'
import HmppsAuditClient from './hmppsAuditClient'
import OrchestratorApiClient from './orchestratorApiClient'
import PrisonerPayApiClient from './prisonerPayApiClient'

const applicationInfo = applicationInfoSupplier()

export const dataAccess = () => {
  const hmppsAuthClient = new AuthenticationClient(
    config.apis.hmppsAuth,
    logger,
    config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore(),
  )

  return {
    applicationInfo,
    hmppsAuthClient,
    orchestratorApiClient: new OrchestratorApiClient(hmppsAuthClient),
    prisonerPayApiClient: new PrisonerPayApiClient(hmppsAuthClient),
    hmppsAuditClient: new HmppsAuditClient(config.sqs.audit),
  }
}

export type DataAccess = ReturnType<typeof dataAccess>

export { AuthenticationClient, HmppsAuditClient, OrchestratorApiClient, PrisonerPayApiClient }
