import path from 'path'
import { Request, Response } from 'express'
import nunjucks from 'nunjucks'
import ConfirmedAddPrisonerHandler from '../../../routes/register/handlers/confirmation/confirmedAddPrisoner'
import ConfirmedRemovalDateHandler from '../../../routes/remove/handlers/confirmedRemovalDate'
import OrchestratorService from '../../../services/orchestratorService'
import TestData from '../../../testutils/testData'
import config from '../../../config'

jest.mock('../../../utils/auditUtils')

const env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader([path.join(__dirname, '../..'), 'node_modules/govuk-frontend/dist']),
  { autoescape: true },
)
env.addFilter('assetMap', (value: string) => value)

describe('confirmation pages', () => {
  beforeEach(() => jest.useFakeTimers().setSystemTime(new Date('2026-01-07T12:00:00Z')))
  afterEach(() => jest.useRealTimers())

  it.each([
    ['2026-01-07', 'today'],
    ['2026-01-08', '8 January 2026'],
  ])('renders the registration confirmation and next steps for %s', async (startDate, expectedDate) => {
    const req = {
      session: { registerConfirmation: { prisoner: TestData.Prisoner(), startDate } },
    } as unknown as Request
    const res = {
      locals: { payType: { description: 'Long-term sick' } },
      render: jest.fn(),
    } as unknown as Response

    await new ConfirmedAddPrisonerHandler().GET(req, res)
    const [view, values] = jest.mocked(res.render).mock.calls[0]
    const html = env.render(`${view}.njk`, values)

    expect(html).toMatch(/<h1[^>]*>\s*Long-term sick status confirmed\s*<\/h1>/)
    expect(html).toContain(`Nicaigh Johnustine (G4529UP) will receive long-term sick pay from ${expectedDate}`)
    expect(html).toContain(`href="${config.activitiesUiUrl}/prisoner-allocations/G4529UP"`)
    expect(html).toContain('take Nicaigh Johnustine off activities they’re allocated to')
    expect(html).toContain('manage Nicaigh Johnustine’s allocations')
    expect(html).toContain('href="../register/new"')
    expect(html).toContain('add someone else to long-term sick')
    expect(html).toContain('What you can do next')
    expect(html.match(/<li>/g)).toHaveLength(3)
  })

  it.each([
    ['07/01/2026', 'today'],
    ['08/01/2026', 'Thursday, 8 January 2026'],
  ])('renders the removal confirmation and next steps for %s', async (selectedDate, expectedDate) => {
    const req = { params: { payStatusId: '123' }, session: { selectedDate } } as unknown as Request
    const res = {
      locals: { payType: { description: 'Long-term sick' } },
      render: jest.fn(),
    } as unknown as Response
    const orchestrator = {
      getPayStatusPeriodById: jest.fn().mockResolvedValue(TestData.PayStatusPeriod()),
    } as unknown as OrchestratorService

    await new ConfirmedRemovalDateHandler(orchestrator).GET(req, res)
    const [view, values] = jest.mocked(res.render).mock.calls[0]
    const html = env.render(`${view}.njk`, values)

    expect(html).toMatch(/<h1[^>]*>\s*Removal complete\s*<\/h1>/)
    expect(html).toContain(`Nicaigh Johnustine (A1234AA) will not receive long-term sick pay after ${expectedDate}.`)
    expect(html).toContain(`href="${config.activitiesUiUrl}/prisoner-allocations/A1234AA"`)
    expect(html).toContain('allocate Nicaigh Johnustine to activities')
    expect(html).toContain('href="../../pay-overview"')
    expect(html).toContain('review people who are on long-term sick')
    expect(html.match(/<li>/g)).toHaveLength(2)
  })

  it('escapes panel and link content', () => {
    const html = env.renderString(
      '{% from "components/confirmation/macro.njk" import appConfirmation %}{{ appConfirmation(params) }}',
      {
        params: {
          titleText: '<b>Confirmed</b>',
          text: '<script>alert(1)</script>',
          nextSteps: [{ text: '<b>Continue</b>', href: '/next?name="test"' }],
        },
      },
    )
    expect(html).toContain('&lt;b&gt;Confirmed&lt;/b&gt;')
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(html).toContain('&lt;b&gt;Continue&lt;/b&gt;')
    expect(html).toContain('href="/next?name=&quot;test&quot;"')
  })
})
