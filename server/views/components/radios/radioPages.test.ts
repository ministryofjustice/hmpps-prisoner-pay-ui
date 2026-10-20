import express, { Request, Response } from 'express'
import nunjucksSetup from '../../../utils/nunjucksSetup'
import TestData from '../../../testutils/testData'
import { NameFormatStyle } from '../../../utils/helpers/nameFormatStyle'
import OrchestratorService from '../../../services/orchestratorService'
import PrisonerPayService from '../../../services/prisonerPayService'
import StartDateHandler from '../../../routes/register/handlers/startDate/startDate'
import EndDateHandler from '../../../routes/register/handlers/endDate/endDate'
import RegisterCancelHandler from '../../../routes/register/handlers/cancel/cancel'
import AddPrisonerResultsHandler from '../../../routes/register/handlers/search/addPrisonerResults'
import RemovalDateHandler from '../../../routes/remove/handlers/removalDate'
import RemovalCancelHandler from '../../../routes/remove/handlers/cancel'
import SetChangeDateHandler from '../../../routes/changePayRate/handlers/setChangeDate'
import CancelRateChangeHandler from '../../../routes/changePayRate/handlers/cancelRateChange'

jest.mock('../../../utils/auditUtils')

const app = express()
nunjucksSetup(app)
const payType = { description: 'Long-term sick', slug: 'long-term-sick', type: 'LONG_TERM_SICK' }
const orchestrator = {
  getPayStatusPeriodById: jest.fn().mockResolvedValue(TestData.PayStatusPeriod()),
  searchPrisoners: jest.fn().mockResolvedValue(TestData.Prisoners()),
  getPayRates: jest.fn().mockResolvedValue([{ ...TestData.PayRate(), startDate: '2999-01-01' }]),
} as unknown as OrchestratorService

const scenarios = [
  {
    handler: new StartDateHandler(),
    field: 'startDateOption',
    question: 'When is Nicaigh Johnustine’s first day on long-term sick?',
  },
  {
    handler: new EndDateHandler(),
    field: 'endDateSelection',
    question: 'Do you want to set how long Nicaigh Johnustine is off sick for?',
  },
  {
    handler: new RegisterCancelHandler(),
    field: 'choice',
    question: 'Are you sure you want to cancel adding Nicaigh Johnustine?',
  },
  {
    handler: new RemovalDateHandler(orchestrator),
    field: 'removalDateOption',
    question: 'When do you want to remove Nicaigh Johnustine from Long-term sick?',
  },
  {
    handler: new RemovalCancelHandler(),
    field: 'choice',
    question: 'Are you sure you want to cancel removing Nicaigh Johnustine?',
  },
  {
    handler: new SetChangeDateHandler(),
    field: 'changeDateOption',
    question: 'When do you want the change to take effect?',
  },
  {
    handler: new CancelRateChangeHandler(orchestrator, {} as PrisonerPayService),
    field: 'choice',
    question: 'Are you sure you want to cancel the pay rate change?',
  },
]

const renderResponse = async (res: Response): Promise<string> => {
  const [view, values] = jest.mocked(res.render).mock.calls[0]
  return new Promise((resolve, reject) => {
    app.render(view, { ...res.locals, ...values, NameFormatStyle, csrfToken: 'test-token' }, (error, html) => {
      if (error) reject(error)
      else resolve(html)
    })
  })
}

describe('radio pages rendered with handler values', () => {
  let req: Request
  let res: Response
  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] }).setSystemTime(new Date('2026-01-07T12:00:00Z'))
    req = {
      params: { payTypeSlug: 'long-term-sick', payStatusId: '123', rateId: TestData.PayRate().id },
      query: { query: 'John' },
      body: {},
      session: {
        registerJourney: {
          prisoner: TestData.Prisoner(),
          searchQuery: 'John',
          startDate: '2026-01-07',
          endDateSelection: 'yes',
        },
        selectedPrisoner: TestData.Prisoner(),
      },
    } as unknown as Request
    res = {
      locals: { payType, user: TestData.PrisonUser() },
      render: jest.fn(),
      redirect: jest.fn(),
    } as unknown as Response
  })
  afterEach(() => jest.useRealTimers())

  it.each(scenarios)('renders $question with radio field $field', async ({ handler, field, question }) => {
    await handler.GET(req, res)
    const html = await renderResponse(res)
    expect(html).toContain(question)
    expect(html).toContain(`name="${field}"`)
    expect(html).toContain('data-module="govuk-radios"')
    expect(html).toContain('value="test-token"')
    if (field === 'endDateSelection') expect(html).toMatch(/value="yes" checked/)
    if (field === 'removalDateOption') expect(html).toContain('Today - Wednesday, 7 January 2026')
    if (field === 'changeDateOption') expect(html).toContain('Tomorrow - Thursday, 8 January 2026')
    if (handler instanceof CancelRateChangeHandler)
      expect(html).toContain('£0.99 per day from Tuesday, 1 January 2999.')
  })

  it.each(scenarios)(
    'keeps $question and links the error after an empty submission',
    async ({ handler, field, question }) => {
      await handler.POST(req, res)
      const html = await renderResponse(res)
      expect(html).toContain(question)
      expect(html).toContain(`href="#${field}"`)
      expect(html).toContain(`id="${field}-error"`)
      expect(html).toContain('govuk-form-group--error')
      expect(res.redirect).not.toHaveBeenCalled()
    },
  )

  it.each([
    { handler: new StartDateHandler(), field: 'startDateOption', date: 'startDate' },
    { handler: new SetChangeDateHandler(), field: 'changeDateOption', date: 'changeDate' },
  ])('retains the custom $date and selected radio on validation failure', async ({ handler, field, date }) => {
    req.body = { [field]: 'other', [date]: '31/02/2026' }
    await handler.POST(req, res)
    const html = await renderResponse(res)
    expect(html).toMatch(/value="other" checked/)
    expect(html).toContain('value="31/02/2026"')
    expect(html).toContain(`id="${date}-error"`)
    expect(html).not.toContain('govuk-radios__conditional--hidden')
  })

  it('keeps the removal date conditional open when a required date is missing', async () => {
    req.body = { removalDateOption: 'other', removalDate: '' }
    await new RemovalDateHandler(orchestrator).POST(req, res)
    const html = await renderResponse(res)
    expect(html).toMatch(/value="other" checked/)
    expect(html).toContain('id="removalDate-error"')
    expect(html).not.toContain('govuk-radios__conditional--hidden')
  })

  it('renders a distinct component radio in each search result row with an accessible label', async () => {
    await new AddPrisonerResultsHandler(orchestrator).GET(req, res)
    const html = await renderResponse(res)
    expect(html.match(/type="radio"/g)).toHaveLength(TestData.Prisoners().length)
    TestData.Prisoners().forEach(prisoner => {
      expect(html).toContain(`id="selected-prisoner-${prisoner.prisonerNumber}"`)
      expect(html).toContain(`for="selected-prisoner-${prisoner.prisonerNumber}"`)
    })
    expect(html).not.toContain('<fieldset')
  })

  it('links the search selection error to the results group and each radio', async () => {
    await new AddPrisonerResultsHandler(orchestrator).POST(req, res)
    const html = await renderResponse(res)
    expect(html).toContain('href="#selectedPrisoner"')
    expect(html).toContain('id="selectedPrisoner"')
    expect(html).toContain('id="selectedPrisoner-error"')
    expect(html).toContain('aria-describedby="selectedPrisoner-error"')
  })
})
