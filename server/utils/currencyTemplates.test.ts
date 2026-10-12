import express from 'express'
import nunjucksSetup from './nunjucksSetup'

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
    ['dashboard/pay-overview', { payType, records: [] }, '£0.65 per day (£3.25 for a 5 day week)'],
    ['dashboard/pay-rates', { payTypes: [{ ...payType, currentRate: 325 }] }, '£3.25 per week'],
    ['changePayRate/cancel-rate-change', { payType, payAmount: 99, selectedDate: new Date() }, '£0.99 per day'],
    ['changePayRate/check-pay-rate', { payType, payAmount: 200, selectedDate: new Date() }, '£2 per day'],
  ])('renders pounds on %s', async (view, locals, expected) => {
    const html = await render(`pages/${view}`, locals)
    expect(html).toContain(expected)
    expect(html).not.toContain('NaN')
  })

  it('handles a missing current rate', async () => {
    const html = await render('pages/dashboard/pay-rates', { payTypes: [payType] })
    expect(html).toContain('? per week')
    expect(html).not.toContain('NaN')
  })
})
