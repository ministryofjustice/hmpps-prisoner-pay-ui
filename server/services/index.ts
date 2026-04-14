import { dataAccess } from '../data'
import AuditService from './auditService'
import OrchestratorService from './orchestratorService'
import PrisonerPayService from './prisonerPayService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, orchestratorApiClient, prisonerPayApiClient } = dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    orchestratorService: new OrchestratorService(orchestratorApiClient),
    prisonerPayService: new PrisonerPayService(prisonerPayApiClient),
  }
}

export type Services = ReturnType<typeof services>
