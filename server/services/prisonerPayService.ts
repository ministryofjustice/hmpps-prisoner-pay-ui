/* eslint-disable @typescript-eslint/no-explicit-any */
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

  patchPayRate(request: any): Promise<void> {
    return this.prisonerPayApiClient.patchPayRate(request)
  }
}
