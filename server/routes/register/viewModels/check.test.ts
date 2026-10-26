import path from 'path'
import nunjucks from 'nunjucks'
import buildCheckPage from './check'
import buildConfirmationPage from './confirmation'
import longTermSick from '../../../statuses/longTermSick'
import { StatusDefinition } from '../../../statuses/types'
import TestData from '../../../testutils/testData'
import { findError } from '../../../utils/utils'

const exampleStatus: StatusDefinition = {
  ...longTermSick,
  check: {
    pageTitle: 'Example review',
    heading: 'Review example details',
    labels: { prisoner: 'Person', startDate: 'First day', endDate: 'Last day' },
    changeLinkText: 'Edit',
    changeDescriptions: { prisoner: 'the person', startDate: 'the first day', endDate: 'the last day' },
    dateLabels: { today: 'Current day', tomorrow: 'Next day' },
    noEndDateText: 'Open ended',
    confirmButtonText: 'Save example status',
    cancelLinkText: 'Cancel example',
  },
  confirmation: {
    pageTitle: 'Example confirmation',
    titleText: 'Example saved',
    text: ({ prisonerName, prisonerNumber, startDateText }) =>
      `${prisonerName} (${prisonerNumber}) starts ${startDateText}`,
    todayText: 'the current day',
    nextSteps: [
      { destination: 'newRegistration', text: () => 'Add another example' },
      { destination: 'prisonerAllocations', text: ({ prisonerName }) => `Review allocations for ${prisonerName}` },
    ],
  },
}

const today = new Date('2026-01-07T12:00:00Z')
const journey = {
  prisoner: TestData.Prisoner(),
  searchQuery: 'John',
  startDate: '2026-01-07',
  endDate: '2026-01-08',
}
const env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader([path.join(__dirname, '../../../views'), 'node_modules/govuk-frontend/dist']),
  { autoescape: true },
)
env.addFilter('assetMap', (value: string) => value)
env.addFilter('findError', findError)

describe('check and confirmation page mappers', () => {
  it('renders configured check content with saved values and existing change routes', () => {
    const page = buildCheckPage(exampleStatus, { journey, today })
    expect(page.summaryList.rows.map(row => [row.key.text, row.value.text])).toEqual([
      ['Person', 'Nicaigh Johnustine'],
      ['First day', 'Current day - 7 January 2026'],
      ['Last day', 'Next day - 8 January 2026'],
    ])
    expect(page.previousPage).toBe('last-day')
    const html = env.render('pages/register/check.njk', {
      ...page,
      applicationName: 'Prisoner Pay',
      csrfToken: 'test-token',
    })
    expect(html).toContain('<title>Prisoner Pay - Example review</title>')
    expect(html).toContain('Review example details')
    expect(html).toContain('Save example status')
    expect(html).toContain('Cancel example')
    expect(html).toContain('Edit<span class="govuk-visually-hidden"> the person</span>')
    expect(html).toContain('href="add-prisoner"')
    expect(html).toContain('href="start-date"')
    expect(html).toContain('href="end-date"')
    expect(html).toContain('href="./last-day"')
    expect(html).toContain('value="test-token"')
  })

  it('uses the configured empty-end-date text and returns to the end-date choice', () => {
    const page = buildCheckPage(exampleStatus, { journey: { ...journey, endDate: undefined }, today })
    expect(page.summaryList.rows[2].value.text).toBe('Open ended')
    expect(page.previousPage).toBe('end-date')
  })

  it.each([
    ['2026-01-07', 'the current day'],
    ['2026-01-08', '8 January 2026'],
  ])('renders configured confirmation content and link order for %s', (startDate, expectedDate) => {
    const page = buildConfirmationPage(exampleStatus, {
      confirmation: { ...journey, startDate },
      today,
      activitiesUiUrl: 'https://activities.example',
    })
    expect(page.confirmation).toEqual({
      titleText: 'Example saved',
      text: `Nicaigh Johnustine (G4529UP) starts ${expectedDate}`,
      nextSteps: [
        { text: 'Add another example', href: '../register/new' },
        {
          text: 'Review allocations for Nicaigh Johnustine',
          href: 'https://activities.example/prisoner-allocations/G4529UP',
        },
      ],
    })
    const html = env.render('pages/register/confirmed-add-prisoner.njk', { ...page, applicationName: 'Prisoner Pay' })
    expect(html).toContain('<title>Prisoner Pay - Example confirmation</title>')
    expect(html).toMatch(/<h1[^>]*>\s*Example saved\s*<\/h1>/)
    expect(html).toContain(`Nicaigh Johnustine (G4529UP) starts ${expectedDate}`)
    expect(html).toContain('href="../register/new"')
    expect(html).toContain('href="https://activities.example/prisoner-allocations/G4529UP"')
  })
})
