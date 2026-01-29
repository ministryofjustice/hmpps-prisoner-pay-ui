import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class CancelRateChangePage extends AbstractPage {
  readonly header: Locator

  readonly yesRadio: Locator

  readonly noRadio: Locator

  readonly confirmButton: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Are you sure you want to cancel the pay rate change?' })
    this.yesRadio = page.getByLabel('Yes')
    this.noRadio = page.getByLabel('No')
    this.confirmButton = page.getByRole('button', { name: 'Confirm' })
  }

  static async verifyOnPage(page: Page): Promise<CancelRateChangePage> {
    const cancelPage = new CancelRateChangePage(page)
    await expect(cancelPage.header).toBeVisible()
    await expect(cancelPage.confirmButton).toBeVisible()
    await expect(cancelPage.yesRadio).toBeVisible()
    await expect(cancelPage.noRadio).toBeVisible()
    return cancelPage
  }
}
