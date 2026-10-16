import express from 'express'
import nunjucksSetup from '../../../utils/nunjucksSetup'
import config from '../../../config'
import { getPayTypeBySlug } from '../../../utils/payTypeUtils'
import { NameFormatStyle } from '../../../utils/helpers/nameFormatStyle'

describe('Pay overview view', () => {
  const app = express()
  nunjucksSetup(app)

  const records = [
    {
      id: 101,
      firstName: 'PETER',
      lastName: 'SMITH',
      prisonerNumber: 'G8785GQ',
      cellLocation: 'A-1-001',
      startDate: '2026-09-01',
      endDate: '2026-10-20',
    },
    {
      id: 102,
      firstName: 'SARAH',
      lastName: 'JONES',
      prisonerNumber: 'A1234BC',
      cellLocation: 'B-2-002',
      startDate: '2026-10-01',
      endDate: null,
    },
  ]

  const render = (viewRecords = records): Promise<string> =>
    new Promise((resolve, reject) => {
      app.render(
        'pages/dashboard/pay-overview',
        { payType: getPayTypeBySlug('long-term-sick'), records: viewRecords, NameFormatStyle },
        (error, html) => {
          if (error) reject(error)
          else resolve(html.replace(/\s+/g, ' ').replace(/\s+>/g, '>'))
        },
      )
    })

  it('links each prisoner name to their profile in a new tab with an accessible warning', async () => {
    const html = await render()

    for (const [index, name] of ['Peter Smith', 'Sarah Jones'].entries()) {
      expect(html).toContain(
        `href="${config.digitalPrisonServiceUrl}/prisoner/${records[index].prisonerNumber}" target="_blank" rel="noopener noreferrer">${name}<span class="govuk-visually-hidden"> (opens in a new tab)</span></a>`,
      )
    }
  })

  it('includes the correct hidden name and destination in each action link', async () => {
    const html = await render()

    expect(html).toMatch(
      /href="\.\/remove\/101\/removal-date">Change end date<span class="govuk-visually-hidden"> for Peter Smith<\/span\s*>\s*<\/a>/,
    )
    expect(html).toMatch(
      /href="\.\/remove\/102\/removal-date">Remove\s*<span class="govuk-visually-hidden">Sarah Jones <\/span>from long-term sick<\/a>/,
    )
  })

  it('renders formatted dates and a fallback for an unset end date', async () => {
    const html = await render()

    expect(html).toContain('1 September 2026')
    expect(html).toContain('20 October 2026')
    expect(html).toContain('1 October 2026')
    expect(html).toContain('None set')
  })

  it('retains sortable table attributes and the vertical alignment styling class', async () => {
    const html = await render()

    expect(html).toMatch(/<table[^>]*class="[^"]*pay-overview-table[^>]*data-module="moj-sortable-table"/)
    expect(html).toContain('data-table-fixed-rows="true"')
    expect(html).toContain('aria-sort="ascending"')
  })

  it('renders the page with no records', async () => {
    const html = await render([])

    expect(html).toContain('Long-term sick')
    expect(html).toContain('data-qa="pay-overview-table"')
    expect(html).not.toContain('data-qa="prisoner-summary"')
  })
})
