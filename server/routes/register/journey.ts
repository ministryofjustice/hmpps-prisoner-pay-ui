export type StartDateOption = 'today' | 'tomorrow' | 'other'
export type EndDateSelection = 'yes' | 'no'

export type RegisterJourney = {
  prisoner: {
    prisonerNumber: string
    firstName: string
    lastName: string
    cellLocation?: string
    status?: string
  }
  searchQuery: string
  // Both dates are stored as ISO calendar dates (yyyy-MM-dd).
  startDate?: string
  startDateOption?: StartDateOption
  endDate?: string
  endDateSelection?: EndDateSelection
  returnTo?: 'start-date' | 'end-date' | 'last-day' | 'check'
}

// Retain only the details needed to refresh the confirmation after the draft is cleared.
export type RegisterConfirmation = Pick<RegisterJourney, 'prisoner' | 'endDate'> & {
  startDate: string
}
