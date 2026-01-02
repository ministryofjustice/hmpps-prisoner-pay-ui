import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class DashboardPage extends AbstractPage {
  readonly header: Locator

  readonly typeList: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Pay dashboard' })
    this.typeList = page.getByTestId('pay-type-list-table')
  }

  static async verifyOnPage(page: Page): Promise<DashboardPage> {
    const homePage = new DashboardPage(page)
    await expect(homePage.header).toBeVisible()
    await expect(homePage.typeList).toBeVisible()
    return homePage
  }

  getTypeLink(linkText: string): Locator {
    return this.typeList.getByRole('link', { name: linkText })
  }
}
