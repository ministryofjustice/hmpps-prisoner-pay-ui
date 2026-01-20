// Helpers for auditing user actions and page views
//
// Any page that simply involves viewing a page without any specific action being taken can use auditPageView
// Any page that involves a specific action (e.g., searching for a prisoner) should use the auditPageAction

import { Request } from 'express'
import { Page, Action, SubjectType } from '../services/auditService'
import { PayTypeConfig } from '../@types/payTypes'
import { Prisoner, PayStatusPeriod } from '../@types/payOrchestratorAPI/types'

// Functions to send view/action audit logs to the audit service

// SubjectType is the type of thing user is interacting with (e.g., PRISONER_ID, SEARCH_TERM)
// subjectId is the specific identifier of that thing (e.g., the actual prisoner number, or the search term used)

export function auditPageView(
  req: Request,
  page: Page,
  details: object,
  subjectType?: SubjectType,
  action?: Action,
  subjectId?: string,
) {
  return req.auditService.logPageView(page, {
    who: req.session.passport.user.username,
    what: action,
    subjectType: subjectType ?? SubjectType.NOT_APPLICABLE,
    details,
    subjectId,
  })
}

export function auditPageAction(
  req: Request,
  page: Page,
  action: Action,
  details: object,
  subjectType?: SubjectType,
  subjectId?: string,
) {
  return req.auditService.logAuditEvent({
    what: `ACTION_${page}_${action}`,
    who: req.session.passport.user.username,
    subjectType: subjectType ?? SubjectType.NOT_APPLICABLE,
    subjectId,
    details,
  })
}

// Functions to format the various detail object for audit logging

export function getDisplayedResults(prisoners: Prisoner[]) {
  return {
    searchResults: prisoners.map(prisoner => ({
      prisonerNumber: prisoner.prisonerNumber,
      cellLocation: prisoner.cellLocation,
    })),
  }
}

export function getDisplayedPaySummary(paySummary: PayStatusPeriod[], payType: PayTypeConfig) {
  return {
    paySummaries: paySummary.map(record => ({
      prisonerNumber: record.prisonerNumber,
      cellLocation: record.cellLocation,
      startDate: record.startDate,
      endDate: record.endDate,
    })),
    payType: payType.type,
  }
}
