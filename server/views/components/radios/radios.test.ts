import path from 'path'
import nunjucks from 'nunjucks'
import { findError } from '../../../utils/utils'

const env = nunjucks.configure(
  [path.join(__dirname, '../..'), 'node_modules/govuk-frontend/dist', 'node_modules/@ministryofjustice/frontend'],
  { autoescape: true },
)

const render = (params: Record<string, unknown>) =>
  env.renderString('{% from "components/radios/macro.njk" import appRadios %}{{ appRadios(params) }}', { params })

env.addFilter('findError', findError)
env.addFilter('assetMap', (value: string) => value)

describe('appRadios', () => {
  it('renders an accessible question, hint, error and selected option while escaping text', () => {
    const html = render({
      name: 'choice',
      legend: 'Choose <script>alert(1)</script>',
      hint: { text: 'Select one option' },
      errorMessage: { text: 'Choose an option' },
      value: 'no',
      classes: 'govuk-radios--inline',
      items: [
        { value: 'yes', text: 'Yes' },
        { value: 'no', text: 'No' },
      ],
    })
    expect(html).toContain('<h1 class="govuk-fieldset__heading">')
    expect(html).toContain('Choose &lt;script&gt;alert(1)&lt;/script&gt;')
    expect(html).toContain('aria-describedby="choice-hint choice-error"')
    expect(html).toContain('govuk-radios--inline')
    expect(html).toMatch(/value="no" checked/)
    expect(html).not.toMatch(/value="yes" checked/)
  })

  it('supports conditional content supplied by the calling template', () => {
    const html = render({
      name: 'choice',
      legend: 'When?',
      value: 'other',
      items: [{ value: 'other', text: 'Another date', conditional: { html: '<p>Additional content</p>' } }],
    })
    expect(html).toContain('data-aria-controls="conditional-choice"')
    expect(html).toContain('id="conditional-choice"')
    expect(html).toContain('<p>Additional content</p>')
    expect(html).not.toContain('govuk-radios__conditional--hidden')
  })

  it.each([
    ['other', false],
    ['today', true],
  ])('renders the date picker on the start-date page with choice %s', (value, hidden) => {
    const html = env.render('pages/register/start-date.njk', {
      payType: { description: 'Long-term sick' },
      searchQuery: 'John',
      csrfToken: 'test-token',
      errors: [{ href: '#startDate', text: 'Enter a real start date' }],
      radios: {
        name: 'startDateOption',
        legend: 'When is Nicaigh Johnustine’s first day on long-term sick?',
        value,
        items: [
          { value: 'today', text: 'Today' },
          {
            value: 'other',
            text: 'A different future date',
            datePicker: {
              id: 'startDate',
              name: 'startDate',
              label: { text: 'Enter or select the start date' },
              hint: { text: 'For example, 27/03/2027' },
              value: '31/02/2026',
              errorMessage: { text: 'Enter a real start date' },
            },
          },
        ],
      },
    })
    expect(html).toContain('When is Nicaigh Johnustine’s first day on long-term sick?')
    expect(html).toContain('href="#startDate"')
    expect(html).toContain('aria-describedby="startDate-hint startDate-error"')
    expect(html).toContain('data-aria-controls="conditional-startDateOption-2"')
    expect(html).toContain('id="conditional-startDateOption-2"')
    expect(html.includes('govuk-radios__conditional--hidden')).toBe(hidden)
    expect(html).toMatch(new RegExp(`value="${value}" checked`))
    expect(html).toContain('data-module="moj-date-picker"')
    expect(html).toContain('value="31/02/2026"')
    expect(html).toContain('value="test-token"')
    expect(html).not.toContain('&lt;input')
  })
})
