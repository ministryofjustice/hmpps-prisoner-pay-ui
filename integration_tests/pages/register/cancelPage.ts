import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class CancelPage extends AbstractPage {
  readonly header: Locator

  readonly confirmButton: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Are you sure you want to cancel adding' })
    this.confirmButton = page.getByRole('button', { name: 'Confirm' })
  }

  static async verifyOnPage(page: Page): Promise<CancelPage> {
    const cancelPage = new CancelPage(page)
    await expect(cancelPage.header).toBeVisible()
    await expect(cancelPage.confirmButton).toBeVisible()
    return cancelPage
  }
}
