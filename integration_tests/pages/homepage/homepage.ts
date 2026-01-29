import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class Homepage extends AbstractPage {
  readonly header: Locator

  readonly typeList: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Prisoner Pay' })
    this.typeList = page.getByTestId('pay_dashboard')
  }

  static async verifyOnPage(page: Page): Promise<Homepage> {
    const homePage = new Homepage(page)
    await expect(homePage.header).toBeVisible()
    await expect(homePage.typeList).toBeVisible()
    return homePage
  }

  getTypeLink(linkText: string): Locator {
    return this.typeList.getByRole('link', { name: linkText })
  }
}
