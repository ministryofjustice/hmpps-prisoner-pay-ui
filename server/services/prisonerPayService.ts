import PrisonerPayApiClient from '../data/prisonerPayApiClient'

export default class PrisonerPayService {
  constructor(private readonly prisonerPayApiClient: PrisonerPayApiClient) {}

  patchPayStatusPeriod(payStatusId: string, body: Record<string, unknown>) {
    return this.prisonerPayApiClient.patchPayStatusPeriod(payStatusId, body)
  }

  postPayStatusPeriod(body: Record<string, unknown>) {
    return this.prisonerPayApiClient.postPayStatusPeriod(body)
  }
}
