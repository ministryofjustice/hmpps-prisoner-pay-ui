import path from 'path'
import nunjucks from 'nunjucks'
import buildCancellationPage from './cancel'
import longTermSick from '../../../statuses/longTermSick'
import { StatusDefinition } from '../../../statuses/types'
import TestData from '../../../testutils/testData'
import { findError } from '../../../utils/utils'

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

describe('buildCancellationPage', () => {
  it('renders configured content and option order while retaining the selection and error', () => {
    const status: StatusDefinition = {
      ...longTermSick,
      cancellation: {
        pageTitle: 'Cancel example registration',
        question: ({ prisonerName }) => `Stop the example registration for ${prisonerName}?`,
        options: ['no', 'yes'],
        optionLabels: { no: 'Keep the draft', yes: 'Discard the draft' },
        confirmButtonText: 'Confirm example choice',
        errors: { missingOption: 'Choose an example action' },
      },
    }
    const page = buildCancellationPage(status, {
      journey: { prisoner: TestData.Prisoner(), searchQuery: 'John' },
      form: { choice: 'no' },
      errors: [{ href: '#choice', text: 'Choose an example action' }],
    })
    expect(page.radios.items).toEqual([
      { value: 'no', text: 'Keep the draft' },
      { value: 'yes', text: 'Discard the draft' },
    ])
    const html = env.render('pages/register/cancel.njk', {
      ...page,
      applicationName: 'Prisoner Pay',
      csrfToken: 'test-token',
    })
    expect(html).toContain('<title>Prisoner Pay - Cancel example registration</title>')
    expect(html).toContain('Stop the example registration for Nicaigh Johnustine?')
    expect(html).toContain('Confirm example choice')
    expect(html).toContain('href="#choice"')
    expect(html).toContain('id="choice-error"')
    expect(html).toContain('aria-describedby="choice-error"')
    expect(html).toContain('Choose an example action')
    expect(html).toMatch(/value="no" checked/)
    expect(html).toContain('value="test-token"')
    expect(html).toContain('href="./add-prisoner"')
  })
})
