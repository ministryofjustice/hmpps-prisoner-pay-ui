export type StartDateOption = 'today' | 'tomorrow' | 'other'
export type EndDateSelection = 'yes' | 'no'
export type CancellationChoice = 'yes' | 'no'

export interface StartDateDefinition {
  question: (context: { prisonerName: string }) => string
  options: readonly StartDateOption[]
  optionLabels: Record<StartDateOption, string>
  dateInput: {
    label: string
    hint: string
  }
  rules: {
    allowPastDates: boolean
  }
  errors: {
    missingOption: string
    missingDate: string
    invalidDate: string
    pastDate: string
  }
}

export interface EndDateDefinition {
  question: (context: { prisonerName: string }) => string
  options: readonly EndDateSelection[]
  optionLabels: Record<EndDateSelection, string>
  errors: {
    missingOption: string
  }
}

export interface LastDayDefinition {
  question: (context: { prisonerName: string }) => string
  hint: string
  rules: {
    allowPastDates: boolean
  }
  errors: {
    missingDate: string
    invalidDate: string
    beforeStartDate: string
    pastDate: string
  }
}

export interface CheckDefinition {
  pageTitle: string
  heading: string
  labels: { prisoner: string; startDate: string; endDate: string }
  changeLinkText: string
  changeDescriptions: { prisoner: string; startDate: string; endDate: string }
  dateLabels: { today: string; tomorrow: string }
  noEndDateText: string
  confirmButtonText: string
  cancelLinkText: string
}

export interface ConfirmationContentContext {
  prisonerName: string
  prisonerNumber: string
  startDateText: string
}

export interface ConfirmationDefinition {
  pageTitle: string
  titleText: string
  text: (context: ConfirmationContentContext) => string
  todayText: string
  nextSteps: readonly {
    destination: 'prisonerAllocations' | 'newRegistration'
    text: (context: ConfirmationContentContext) => string
  }[]
}

export interface CancellationDefinition {
  pageTitle: string
  question: (context: { prisonerName: string }) => string
  options: readonly CancellationChoice[]
  optionLabels: Record<CancellationChoice, string>
  confirmButtonText: string
  errors: { missingOption: string }
}

export interface StatusDefinition {
  startDate: StartDateDefinition
  endDate: EndDateDefinition
  lastDay: LastDayDefinition
  check: CheckDefinition
  confirmation: ConfirmationDefinition
  cancellation: CancellationDefinition
}
