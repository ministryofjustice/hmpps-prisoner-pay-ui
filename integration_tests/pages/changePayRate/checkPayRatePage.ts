import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class CheckPayRatePage extends AbstractPage {
  readonly header: Locator

  readonly payAmountRow: Locator

  readonly dateRow: Locator

  readonly confirmButton: Locator

  readonly cancelLink: Locator

  readonly changePayAmountLink: Locator

  readonly changeDateLink: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Check and confirm the pay change' })
    this.payAmountRow = page.locator('dt', { hasText: 'Pay amount' }).locator('..')
    this.dateRow = page.locator('dt', { hasText: 'Date the change takes effect' }).locator('..')
    this.confirmButton = page.locator('button', { hasText: 'Confirm pay change' })
    this.cancelLink = page.locator('a', { hasText: 'Cancel' })
    this.changePayAmountLink = page.locator('a', { hasText: /Change.*pay amount/ })
    this.changeDateLink = page.locator('a', { hasText: /Change.*pay rate change date/ })
  }

  static async verifyOnPage(page: Page): Promise<CheckPayRatePage> {
    const checkPayRatePage = new CheckPayRatePage(page)
    await expect(checkPayRatePage.header).toBeVisible()
    await expect(checkPayRatePage.confirmButton).toBeVisible()
    await expect(checkPayRatePage.cancelLink).toBeVisible()
    return checkPayRatePage
  }

  async confirmPayChange(): Promise<void> {
    await this.confirmButton.click()
  }

  async clickCancel(): Promise<void> {
    await this.cancelLink.click()
  }

  async changePayAmount(): Promise<void> {
    await this.changePayAmountLink.click()
  }

  async changeDate(): Promise<void> {
    await this.changeDateLink.click()
  }
}
