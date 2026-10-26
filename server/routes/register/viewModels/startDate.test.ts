import buildStartDatePage from './startDate'
import longTermSick from '../../../statuses/longTermSick'
import { StatusDefinition } from '../../../statuses/types'
import TestData from '../../../testutils/testData'
import validateStartDate from '../handlers/startDate/startDateValidation'

// An example definition exercises variation without enabling another real status.
const exampleStatus: StatusDefinition = {
  ...longTermSick,
  startDate: {
    ...longTermSick.startDate,
    question: ({ prisonerName }) => `Choose a date for ${prisonerName}`,
    options: ['other', 'tomorrow'],
    optionLabels: { today: 'Current day', tomorrow: 'Next day', other: 'Enter a date' },
    dateInput: { label: 'Example date', hint: 'Example hint' },
    rules: { allowPastDates: true },
  },
}

const context = {
  journey: { prisoner: TestData.Prisoner(), searchQuery: 'John' },
  form: { startDateOption: 'other', startDate: '31/02/2026' },
  errors: [{ href: '#startDate', text: 'Invalid example date' }],
  today: new Date('2026-01-07T12:00:00Z'),
}

describe('buildStartDatePage', () => {
  it('uses configured wording and option order while retaining invalid input and its error', () => {
    const page = buildStartDatePage(exampleStatus, context)
    expect(page.searchQuery).toBe('John')
    expect(page.errors).toEqual(context.errors)
    expect(page.radios.legend).toBe('Choose a date for Nicaigh Johnustine')
    expect(page.radios.value).toBe('other')
    expect(page.radios.items).toEqual([
      {
        value: 'other',
        text: 'Enter a date',
        datePicker: {
          id: 'startDate',
          name: 'startDate',
          label: { text: 'Example date' },
          hint: { text: 'Example hint' },
          value: '31/02/2026',
          errorMessage: { text: 'Invalid example date' },
        },
      },
      { value: 'tomorrow', text: 'Next day - 8 January 2026' },
    ])
  })

  it('renders the same options that validation accepts', () => {
    const page = buildStartDatePage(exampleStatus, context)
    const offered = page.radios.items.map(item => item.value)
    ;(['today', 'tomorrow', 'other'] as const).forEach(startDateOption => {
      const result = validateStartDate({ startDateOption, startDate: '06/01/2026' }, exampleStatus.startDate, {
        today: context.today,
      })
      expect(result.valid).toBe(offered.includes(startDateOption))
    })
  })
})
