import { Request } from 'express'
import AuditService, { Page, Action, SubjectType } from '../services/auditService'
import PayType from '../@types/payTypes'
import * as auditUtils from './auditUtils'
import TestData from '../testutils/testData'

jest.mock('../services/auditService')

describe('auditUtils', () => {
  let req: Request
  let mockAuditService: jest.Mocked<AuditService>

  beforeEach(() => {
    jest.clearAllMocks()

    mockAuditService = {
      logPageView: jest.fn().mockResolvedValue(undefined),
      logAuditEvent: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<AuditService>

    const prisonUser = TestData.PrisonUser()

    req = {
      auditService: mockAuditService,
      session: {
        passport: {
          user: {
            username: prisonUser.username,
          },
        },
      },
    } as unknown as Request
  })

  describe('auditPageView', () => {
    it('should call logPageView with correct parameters', async () => {
      const page = Page.DASHBOARD
      const details: Record<string, unknown> = { payTypes: ['type1'], prisonPopulation: 1000 }

      await auditUtils.auditPageView(req, page, details)

      expect(mockAuditService.logPageView).toHaveBeenCalledWith(page, {
        what: undefined,
        who: TestData.PrisonUser().username,
        subjectType: SubjectType.NOT_APPLICABLE,
        details,
        subjectId: undefined,
      })
    })

    it('should call logPageView with subjectType and subjectId', async () => {
      const page = Page.PAY_OVERVIEW
      const details: Record<string, unknown> = { paySummaries: [] }
      const subjectType = SubjectType.PRISONER_ID
      const subjectId = 'A1234BC'

      await auditUtils.auditPageView(req, page, details, subjectType, undefined, subjectId)

      expect(mockAuditService.logPageView).toHaveBeenCalledWith(page, {
        what: undefined,
        who: TestData.PrisonUser().username,
        subjectType,
        details,
        subjectId,
      })
    })
  })

  describe('auditPageAction', () => {
    it('should call logAuditEvent with correct parameters', async () => {
      const page = Page.ADD_PRISONER
      const action = Action.SEARCH_PRISONER
      const details: Record<string, unknown> = { searchTerm: 'G4529UP' }

      await auditUtils.auditPageAction(req, page, action, details)

      expect(mockAuditService.logAuditEvent).toHaveBeenCalledWith({
        what: `ACTION_${page}_${action}`,
        who: TestData.PrisonUser().username,
        subjectType: SubjectType.NOT_APPLICABLE,
        subjectId: undefined,
        details,
      })
    })
  })

  describe('getDisplayedResults', () => {
    it('should format prisoners with prisonerNumber and cellLocation', () => {
      const prisoners = TestData.Prisoners()

      const result = auditUtils.getDisplayedResults(prisoners)

      expect(result).toEqual({
        searchResults: [
          {
            prisonerNumber: 'G4529UP',
            cellLocation: 'COURT',
          },
          {
            prisonerNumber: 'G4701UT',
            cellLocation: 'E-S-2-018',
          },
        ],
      })
    })
  })

  describe('getDisplayedPaySummary', () => {
    it('should format pay summaries with required fields', () => {
      const paySummary = TestData.PayStatusPeriods()

      const payType = {
        type: PayType.LONG_TERM_SICK,
        description: 'Long Term Sick Pay',
        slug: 'long-term-sick',
        displayName: 'Long Term Sick',
        dailyPayAmount: 100,
      }

      const result = auditUtils.getDisplayedPaySummary(paySummary, payType)

      expect(result).toEqual({
        paySummaries: [
          {
            prisonerNumber: 'A1234AA',
            cellLocation: 'A-1-002',
            startDate: '2025-08-12',
            endDate: undefined,
          },
          {
            prisonerNumber: 'A1234AB',
            cellLocation: 'A-1-002',
            startDate: '2025-05-03',
            endDate: undefined,
          },
          {
            prisonerNumber: 'A1234AC',
            cellLocation: 'A-1-002',
            startDate: '2025-07-23',
            endDate: undefined,
          },
        ],
        payType: 'LONG_TERM_SICK',
      })
    })
  })
})
