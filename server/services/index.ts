import { dataAccess } from '../data'
import AuditService from './auditService'
import ExampleService from './exampleService'
import OrchestratorService from './orchestratorService'
import PrisonerPayService from './prisonerPayService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, exampleApiClient, orchestratorApiClient, prisonerPayApiClient } =
    dataAccess()

  return {
    applicationInfo,
    auditService: new AuditService(hmppsAuditClient),
    exampleService: new ExampleService(exampleApiClient),
    orchestratorService: new OrchestratorService(orchestratorApiClient),
    prisonerPayService: new PrisonerPayService(prisonerPayApiClient),
  }
}

export type Services = ReturnType<typeof services>
