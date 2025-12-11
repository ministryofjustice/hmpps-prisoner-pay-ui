import { RestClient } from '@ministryofjustice/hmpps-rest-client'
import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'

export default class OrchestratorApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('orchestrator API', config.apis.exampleApi, logger, authenticationClient)
  }

  getPayTypes() {
    return [
      {
        id: 1,
        key: 'LTS',
        description: 'Long-term Sick',
        prisonerCount: 12,
        url: '/long-term-sick',
      },
    ]
  }

  getPaySummaryByType(searchType: string) {
    return [
      {
        id: 1,
        code: 'LTS',
        type: 'LONG_TERM_SICK',
        description: 'Long-term Sick',
        dailyPayAmount: 65,
        registeredPrisoners: [
          {
            prisonerNumber: 'AB1234C',
            prisonerName: 'Aconcaga, Bryony',
            cellLocation: 'A-1-100',
            status: 'LTS',
            startDate: '2025-04-10',
            endDate: null,
          },
          {
            prisonerNumber: 'CD6253D',
            prisonerName: 'Denali, Frances',
            cellLocation: 'B-2-056',
            status: 'LTS',
            startDate: '2025-03-01',
            endDate: null,
          },
          {
            prisonerNumber: 'AH8374B',
            prisonerName: 'Elbrus, Veronica',
            cellLocation: 'A-2-007',
            status: 'LTS',
            startDate: '2025-08-01',
            endDate: '2025-01-03',
          },
        ],
      },
    ].find(payType => payType.type === searchType)
  }

  getLongTermSick() {
    return [
      {
        prisonerNumber: 'AB1234C',
        prisonerName: 'Aconcaga, Bryony',
        cellLocation: 'A-1-100',
        status: 'LTS',
        startDate: '2025-04-10',
        endDate: null,
      },
      {
        prisonerNumber: 'CD6253D',
        prisonerName: 'Denali, Frances',
        cellLocation: 'B-2-056',
        status: 'LTS',
        startDate: '2025-03-01',
        endDate: null,
      },
      {
        prisonerNumber: 'AH8374B',
        prisonerName: 'Elbrus, Veronica',
        cellLocation: 'A-2-007',
        status: 'LTS',
        startDate: '2025-08-01',
        endDate: '2025-01-03',
      },
    ]
  }
}
