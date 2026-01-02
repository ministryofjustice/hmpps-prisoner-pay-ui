import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class PayOverviewPage extends AbstractPage {
  readonly header: Locator

  readonly addPersonButton: Locator

  readonly payOverviewTable: Locator

  private constructor(page: Page, type: string) {
    super(page)
    this.header = page.locator('h1', { hasText: type })
    this.addPersonButton = page.getByTestId('add-to-pay-type-button')
    this.payOverviewTable = page.getByTestId('pay-overview-table')
  }

  static async verifyOnPage(page: Page, type: string): Promise<PayOverviewPage> {
    const payOverviewPage = new PayOverviewPage(page, type)
    await expect(payOverviewPage.header).toBeVisible()
    await expect(payOverviewPage.addPersonButton).toBeVisible()
    await expect(payOverviewPage.payOverviewTable).toBeVisible()
    return payOverviewPage
  }
}
