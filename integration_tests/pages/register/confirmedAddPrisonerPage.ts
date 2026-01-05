import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class ConfirmedAddPrisonerPage extends AbstractPage {
  readonly header: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'will now be paid' })
  }

  static async verifyOnPage(page: Page): Promise<ConfirmedAddPrisonerPage> {
    const confirmedAddPrisonerPage = new ConfirmedAddPrisonerPage(page)
    await expect(confirmedAddPrisonerPage.header).toBeVisible()
    return confirmedAddPrisonerPage
  }
}
