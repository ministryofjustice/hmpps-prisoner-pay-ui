import HmppsAuditClient, { AuditEvent } from '../data/hmppsAuditClient'

export enum Page {
  EXAMPLE_PAGE = 'EXAMPLE_PAGE',
  DASHBOARD = 'DASHBOARD',
  CONFIRMED_ADD_DATE = 'CONFIRMED_ADD_PRISONER_PAY_DATE',
  CONFIRMED_REMOVE_DATE = 'CONFIRMED_REMOVE_PRISONER_PAY_DATE',
  PAY_OVERVIEW = 'PAY_OVERVIEW',
  ADD_PRISONER = 'ADD_PRISONER',
  SET_END_DATE = 'SET_END_DATE',
  SET_REMOVAL_DATE = 'SET_REMOVAL_DATE',
  ADD_PRISONER_RESULTS = 'ADD_PRISONER_RESULTS',
  CHECK_CONFIRM_PAY = 'CHECK_CONFIRM_PAY_DETAILS',
  CHECK_REMOVE_PAY = 'CHECK_REMOVE_PAY_DETAILS',
}

export enum Action {
  VIEW = 'VIEW',
  SEARCH_PRISONER = 'SEARCH_PRISONER',
  VIEW_SEARCH_RESULT = 'VIEW_SEARCH_RESULT',
  EDIT_STATUS_PERIOD = 'DELETE_PAY_STATUS_PERIOD',
  CREATE_STATUS_PERIOD = 'CREATE_PAY_STATUS_PERIOD',
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
