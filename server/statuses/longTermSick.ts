import { StatusDefinition } from './types'

const longTermSick: StatusDefinition = {
  startDate: {
    question: ({ prisonerName }) => `When is ${prisonerName}’s first day on long-term sick?`,
    options: ['today', 'tomorrow', 'other'],
    optionLabels: {
      today: 'Today',
      tomorrow: 'Tomorrow',
      other: 'A different future date',
    },
    dateInput: {
      label: 'Enter or select the start date',
      hint: 'For example, 27/03/2027',
    },
    rules: {
      allowPastDates: false,
    },
    errors: {
      missingOption: 'Select when this status should start',
      missingDate: 'Enter or select a start date',
      invalidDate: 'Enter a real start date',
      pastDate: 'The start date must be today or in the future',
    },
  },
  endDate: {
    question: ({ prisonerName }) => `Do you want to set how long ${prisonerName} is off sick for?`,
    options: ['yes', 'no'],
    optionLabels: { yes: 'Yes', no: 'No' },
    errors: { missingOption: 'Select if you want to set their last day or not' },
  },
  lastDay: {
    question: ({ prisonerName }) => `When is the last day of ${prisonerName}'s time off sick?`,
    hint: 'Enter the date, for example 27/03/2027, or click the calendar to select',
    rules: { allowPastDates: false },
    errors: {
      missingDate: 'Enter or select a date',
      invalidDate: 'Enter a real date',
      beforeStartDate: 'Their last day must be today or in the future',
      pastDate: 'The end date cannot be in the past',
    },
  },
  check: {
    pageTitle: 'check and confirm',
    heading: 'Check and confirm details',
    labels: { prisoner: "Who you're adding", startDate: 'Start date', endDate: 'End Date' },
    changeLinkText: 'Change',
    changeDescriptions: { prisoner: 'change prisoner', startDate: 'start date', endDate: 'change end date' },
    dateLabels: { today: 'Today', tomorrow: 'Tomorrow' },
    noEndDateText: 'None set',
    confirmButtonText: 'Confirm and add to long-term sick',
    cancelLinkText: 'Cancel',
  },
  confirmation: {
    pageTitle: 'Add prisoner confirmation',
    titleText: 'Long-term sick status confirmed',
    text: ({ prisonerName, prisonerNumber, startDateText }) =>
      `${prisonerName} (${prisonerNumber}) will receive long-term sick pay from ${startDateText}`,
    todayText: 'today',
    nextSteps: [
      {
        destination: 'prisonerAllocations',
        text: ({ prisonerName }) => `take ${prisonerName} off activities they’re allocated to`,
      },
      { destination: 'prisonerAllocations', text: ({ prisonerName }) => `manage ${prisonerName}’s allocations` },
      { destination: 'newRegistration', text: () => 'add someone else to long-term sick' },
    ],
  },
  cancellation: {
    pageTitle: 'cancel',
    question: ({ prisonerName }) => `Are you sure you want to cancel adding ${prisonerName}?`,
    options: ['yes', 'no'],
    optionLabels: { yes: 'Yes', no: 'No' },
    confirmButtonText: 'Confirm',
    errors: { missingOption: 'Select cancellation option' },
  },
}

export default longTermSick
