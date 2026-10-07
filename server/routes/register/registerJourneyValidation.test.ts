import hasValidEndDate, { getRegisterJourneyRedirect } from './registerJourneyValidation'
import { RegisterJourney } from './journey'
import TestData from '../../testutils/testData'

describe('saved registration date validation', () => {
  const journey: RegisterJourney = { prisoner: TestData.Prisoner(), searchQuery: 'test', startDate: '2026-01-20' }

  it.each([
    { endDateSelection: 'yes' as const, endDate: '2026-01-20', valid: true },
    { endDateSelection: 'yes' as const, endDate: '2026-01-21', valid: true },
    { endDateSelection: 'yes' as const, endDate: '2026-01-19', valid: false },
    { endDateSelection: 'yes' as const, endDate: '2026-02-30', valid: false },
    { endDateSelection: 'yes' as const, endDate: '21/01/2026', valid: false },
    { endDateSelection: 'yes' as const, endDate: undefined, valid: false },
    { endDateSelection: 'no' as const, endDate: undefined, valid: true },
    { endDateSelection: 'no' as const, endDate: '2026-01-21', valid: false },
    { endDateSelection: undefined, endDate: undefined, valid: false },
  ])('validates saved dates: %j', ({ endDateSelection, endDate, valid }) => {
    expect(hasValidEndDate({ ...journey, endDateSelection, endDate })).toBe(valid)
  })
})

describe('registration step required before check answers', () => {
  const journey: RegisterJourney = {
    prisoner: TestData.Prisoner(),
    searchQuery: 'test',
    startDate: '2026-01-20',
    endDateSelection: 'no',
  }

  beforeEach(() => jest.useFakeTimers().setSystemTime(new Date('2026-01-20T12:00:00Z')))
  afterEach(() => jest.useRealTimers())

  it('returns to search when the journey is missing', () => {
    expect(getRegisterJourneyRedirect(undefined)).toBe('add-prisoner')
  })

  it.each([undefined, 'invalid', '2026-01-19'])('requires a new start date for %s', startDate => {
    expect(getRegisterJourneyRedirect({ ...journey, startDate })).toBe('start-date')
  })

  it('requires the end-date question to be answered', () => {
    expect(getRegisterJourneyRedirect({ ...journey, endDateSelection: undefined })).toBe('end-date')
  })

  it('returns to end date when it precedes the chosen start date', () => {
    expect(getRegisterJourneyRedirect({ ...journey, endDateSelection: 'yes', endDate: '2026-01-19' })).toBe('last-day')
  })

  it('allows a complete journey without an end date', () => {
    expect(getRegisterJourneyRedirect(journey)).toBeUndefined()
  })

  it('allows a same-day end date', () => {
    expect(getRegisterJourneyRedirect({ ...journey, endDateSelection: 'yes', endDate: '2026-01-20' })).toBeUndefined()
  })
})
