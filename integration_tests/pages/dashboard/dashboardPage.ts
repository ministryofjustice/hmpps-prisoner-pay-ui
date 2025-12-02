import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class DashboardPage extends AbstractPage {
  readonly header: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Pay dashboard' })
  }

  static async verifyOnPage(page: Page): Promise<DashboardPage> {
    const homePage = new DashboardPage(page)
    await expect(homePage.header).toBeVisible()
    return homePage
  }
}
