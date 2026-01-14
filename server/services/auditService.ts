import HmppsAuditClient, { AuditEvent } from '../data/hmppsAuditClient'

export enum Page {
  EXAMPLE_PAGE = 'EXAMPLE_PAGE',
  DASHBOARD = 'DASHBOARD',
  CONFIRM = 'CONFIRM',
  PAY_OVERVIEW = 'PAY_OVERVIEW',
  ADD_PRISONER = 'ADD_PRISONER',
  SET_END_DATE = 'SET_END_DATE',
  ADD_PRISONER_RESULTS = 'ADD_PRISONER_RESULTS',
  CHECK_PAGE = 'CHECK_PAGE',
}

export enum Action {
  VIEW = 'VIEW',
  SEARCH_PRISONER = 'SEARCH_PRISONER',
  VIEW_SEARCH_RESULT = 'VIEW_SEARCH_RESULT',
  VIEW_CHECK_PAY_STATUS_PERIOD = 'VIEW_CHECK_PAY_STATUS_PERIOD',
  VIEW_CONFIRM_PAY_STATUS_PERIOD = 'VIEW_CONFIRM_PAY_STATUS_PERIOD',
  DELETE_PAY_STATUS_PERIOD = 'DELETE_PAY_STATUS_PERIOD',
}

export enum SubjectType {
  PRISONER_ID = 'PRISONER_ID',
  SEARCH_TERM = 'SEARCH_TERM',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

export interface PageViewEventDetails {
  who: string
  what: Action
  subjectId?: string
  subjectType?: SubjectType
  correlationId?: string
  details?: object
}

export default class AuditService {
  constructor(private readonly hmppsAuditClient: HmppsAuditClient) {}

  async logAuditEvent(event: AuditEvent) {
    await this.hmppsAuditClient.sendMessage(event)
  }

  async logPageView(page: Page, eventDetails: PageViewEventDetails) {
    const event: AuditEvent = {
      ...eventDetails,
      what: `PAGE_VIEW_${page}`,
    }
    await this.hmppsAuditClient.sendMessage(event)
  }
}
