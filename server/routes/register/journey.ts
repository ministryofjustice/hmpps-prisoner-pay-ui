export type RegisterJourney = {
  prisoner: {
    prisonerNumber: string
    firstName: string
    lastName: string
    cellLocation?: string
    status?: string
  }
  searchQuery: string
  startDate?: string
  startDateOption?: string
  // The end-date picker uses dd/MM/yyyy; the API payload converts it to ISO.
  endDate?: string
  endDateSelection?: string
  returnTo?: 'start-date' | 'end-date' | 'check'
}

// Retain only the details needed to refresh the confirmation after the draft is cleared.
export type RegisterConfirmation = Pick<RegisterJourney, 'prisoner' | 'startDate' | 'endDate'>
