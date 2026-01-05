import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class ConfirmedRemovalDatePage extends AbstractPage {
  readonly header: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Removal complete' })
  }

  static async verifyOnPage(page: Page): Promise<ConfirmedRemovalDatePage> {
    const confirmedRemovalDatePage = new ConfirmedRemovalDatePage(page)
    await expect(confirmedRemovalDatePage.header).toBeVisible()
    return confirmedRemovalDatePage
  }
}
