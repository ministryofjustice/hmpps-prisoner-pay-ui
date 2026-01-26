import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class RemovalDatePage extends AbstractPage {
  readonly header: Locator

  readonly todayRadio: Locator

  readonly cancelLink: Locator

  readonly otherRadio: Locator

  readonly continueButton: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1')
    this.todayRadio = page.getByLabel('Today')
    this.otherRadio = page.getByLabel('A different date')
    this.cancelLink = page.getByRole('link', { name: 'Cancel' })
    this.continueButton = page.getByRole('button', { name: 'Continue' })
  }

  static async verifyOnPage(page: Page): Promise<RemovalDatePage> {
    const removalDatePage = new RemovalDatePage(page)
    await expect(removalDatePage.header).toBeVisible()
    await expect(removalDatePage.continueButton).toBeVisible()
    await expect(removalDatePage.cancelLink).toBeVisible()
    return removalDatePage
  }
}
