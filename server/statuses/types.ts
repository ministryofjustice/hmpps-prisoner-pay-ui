export type StartDateOption = 'today' | 'tomorrow' | 'other'
export type EndDateSelection = 'yes' | 'no'

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

export interface StatusDefinition {
  startDate: StartDateDefinition
  endDate: EndDateDefinition
  lastDay: LastDayDefinition
}
