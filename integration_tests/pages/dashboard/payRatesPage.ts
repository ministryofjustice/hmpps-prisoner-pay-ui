import { type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class PayRatesPage extends AbstractPage {
  readonly header: Locator

  readonly payTypeSummaryCards: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Pay rates for people who are not in work' })
    this.payTypeSummaryCards = page.locator('[class*="govuk-summary-list"]')
  }
}
