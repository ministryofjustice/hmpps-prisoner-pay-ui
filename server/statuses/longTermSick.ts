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
}

export default longTermSick
