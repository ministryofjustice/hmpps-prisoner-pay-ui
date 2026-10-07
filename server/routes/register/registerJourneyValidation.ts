import { isValid, parseISO, startOfToday } from 'date-fns'
import { RegisterJourney } from './journey'

export default function hasValidEndDate({ startDate, endDate, endDateSelection }: RegisterJourney): boolean {
  if (endDateSelection === 'no') return endDate === undefined
  if (endDateSelection !== 'yes' || !endDate || !startDate) return false

  const start = parseISO(startDate)
  const end = parseISO(endDate)
  return isValid(start) && isValid(end) && end >= start
}

export function getRegisterJourneyRedirect(
  journey: RegisterJourney | undefined,
): 'add-prisoner' | 'start-date' | 'end-date' | 'last-day' | undefined {
  if (!journey) return 'add-prisoner'
  const start = journey.startDate ? parseISO(journey.startDate) : undefined
  if (!isValid(start) || start < startOfToday()) return 'start-date'
  if (!hasValidEndDate(journey)) return journey.endDateSelection === 'yes' ? 'last-day' : 'end-date'
  return undefined
}
