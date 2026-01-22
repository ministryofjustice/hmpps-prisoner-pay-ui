import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class CheckPage extends AbstractPage {
  readonly header: Locator

  readonly cancelLink: Locator

  readonly confirmButton: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Check and confirm details' })
    this.cancelLink = page.getByRole('link', { name: 'Cancel' })
    this.confirmButton = page.getByRole('button', { name: 'Confirm' })
  }

  static async verifyOnPage(page: Page): Promise<CheckPage> {
    const checkPage = new CheckPage(page)
    await expect(checkPage.header).toBeVisible()
    await expect(checkPage.cancelLink).toBeVisible()
    await expect(checkPage.confirmButton).toBeVisible()
    return checkPage
  }
}
