import { CreatePayStatusPeriodRequest, UpdatePayStatusPeriodRequest } from '../@types/prisonerPayAPI/types'
import PrisonerPayApiClient from '../data/prisonerPayApiClient'

export default class PrisonerPayService {
  constructor(private readonly prisonerPayApiClient: PrisonerPayApiClient) {}

  patchPayStatusPeriod(payStatusId: string, request: UpdatePayStatusPeriodRequest) {
    return this.prisonerPayApiClient.patchPayStatusPeriod(payStatusId, request)
  }

  postPayStatusPeriod(request: CreatePayStatusPeriodRequest) {
    return this.prisonerPayApiClient.postPayStatusPeriod(request)
  }
}
