import express from 'express'
import nunjucksSetup from './nunjucksSetup'
import { getAllPayTypes } from './payTypeUtils'

const app = express()
nunjucksSetup(app)

const render = (view: string, locals: Record<string, unknown>): Promise<string> =>
  new Promise((resolve, reject) => {
    app.render(view, locals, (error, html) => {
      if (error) reject(error)
      else resolve(html)
    })
  })

const payType = { description: 'Long-term sick', dailyPayAmount: 65 }

describe('currency in page templates', () => {
  it.each([
    ['changePayRate/pay-amount', { payType }, '£0.65 per day (£3.25 per week)'],
    ['dashboard/pay-overview', { payType, records: [] }, '£0.65 per day (£3.25 per week)'],
    ['dashboard/pay-rates', { payTypes: [{ ...payType, currentRate: 325 }] }, '£3.25 per week'],
    ['changePayRate/check-pay-rate', { payType, payAmount: 200, selectedDate: new Date() }, '£2 per day'],
  ])('renders pounds on %s', async (view, locals, expected) => {
    const html = await render(`pages/${view}`, locals)
    expect(html.replace(/\s+/g, ' ')).toContain(expected)
    expect(html).not.toContain('NaN')
  })

  it('shows change and cancellation links for short-term sick and overview links', async () => {
    const html = await render('pages/dashboard/pay-rates', {
      payTypes: getAllPayTypes().map(type => ({ ...type, currentRate: 325, scheduledRateId: 'future-rate' })),
    })
    expect(html).toContain('Short-term sick')
    expect(html).toContain('../short-term-sick/change-pay-rate/pay-amount')
    expect(html).toContain('../short-term-sick/change-pay-rate/future-rate/cancel-rate-change')
    expect(html).toContain('../long-term-sick/pay-overview')
    expect(html).toContain('../short-term-sick/pay-overview')
  })

  it('handles a missing current rate', async () => {
    const html = await render('pages/dashboard/pay-rates', { payTypes: [payType] })
    expect(html).toContain('? per week')
    expect(html).not.toContain('NaN')
  })
})
