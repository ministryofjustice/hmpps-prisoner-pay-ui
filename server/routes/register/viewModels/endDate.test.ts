import path from 'path'
import nunjucks from 'nunjucks'
import buildEndDatePage from './endDate'
import buildLastDayPage from './lastDay'
import longTermSick from '../../../statuses/longTermSick'
import { StatusDefinition } from '../../../statuses/types'
import TestData from '../../../testutils/testData'
import { findError } from '../../../utils/utils'
import validateEndDate from '../handlers/endDate/endDateValidation'

const exampleStatus: StatusDefinition = {
  ...longTermSick,
  endDate: {
    question: ({ prisonerName }) => `Set an end date for ${prisonerName}?`,
    options: ['no', 'yes'],
    optionLabels: { no: 'Leave it open', yes: 'Set a last day' },
    errors: { missingOption: 'Choose an end-date option' },
  },
  lastDay: {
    ...longTermSick.lastDay,
    question: ({ prisonerName }) => `Choose the final day for ${prisonerName}`,
    hint: 'Enter an example date',
  },
}

const journey = { prisoner: TestData.Prisoner(), searchQuery: 'John', startDate: '2026-01-07' }
const env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader([
    path.join(__dirname, '../../../views'),
    'node_modules/govuk-frontend/dist',
    'node_modules/@ministryofjustice/frontend',
  ]),
  { autoescape: true },
)
env.addFilter('assetMap', (value: string) => value)
env.addFilter('findError', findError)

describe('end-date page mappers', () => {
  it('uses the definition for wording and option order, preserving the selection and error', () => {
    const page = buildEndDatePage(exampleStatus, {
      journey,
      form: { endDateSelection: 'yes' },
      errors: [{ href: '#endDateSelection', text: 'Choose an end-date option' }],
    })
    expect(page.radios).toEqual({
      name: 'endDateSelection',
      classes: 'govuk-radios',
      legend: 'Set an end date for Nicaigh Johnustine?',
      value: 'yes',
      errorMessage: { text: 'Choose an end-date option' },
      items: [
        { value: 'no', text: 'Leave it open' },
        { value: 'yes', text: 'Set a last day' },
      ],
    })
  })

  it('offers the same choices validation accepts when a definition restricts options', () => {
    const status: StatusDefinition = { ...exampleStatus, endDate: { ...exampleStatus.endDate, options: ['yes'] } }
    const page = buildEndDatePage(status, { journey, form: {}, errors: [] })
    expect(page.radios.items.map(item => item.value)).toEqual(['yes'])
    expect(validateEndDate({ endDateSelection: 'yes' }, status.endDate).valid).toBe(true)
    expect(validateEndDate({ endDateSelection: 'no' }, status.endDate).valid).toBe(false)
  })

  it('renders the last-day definition with invalid input, linked errors, and existing navigation', () => {
    const page = buildLastDayPage(exampleStatus, {
      journey,
      form: { selectedDate: '31/02/2026' },
      errors: [{ href: '#selectedDate', text: 'Example invalid date' }],
    })
    const html = env.render('pages/register/last-day.njk', { ...page, csrfToken: 'test-token' })
    expect(html).toContain('Choose the final day for Nicaigh Johnustine')
    expect(html).toContain('Enter an example date')
    expect(html).toContain('value="31/02/2026"')
    expect(html).toContain('href="#selectedDate"')
    expect(html).toContain('aria-describedby="selectedDate-hint selectedDate-error"')
    expect(html).toContain('Example invalid date')
    expect(html).toContain('value="test-token"')
    expect(html).toContain('href="./end-date"')
    expect(html).toContain('href="cancel"')
  })
})
