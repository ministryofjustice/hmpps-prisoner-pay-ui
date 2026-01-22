import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class EndDatePage extends AbstractPage {
  readonly header: Locator

  readonly yesRadio: Locator

  readonly noRadio: Locator

  readonly endDateInput: Locator

  readonly cancelLink: Locator

  readonly continueButton: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1')
    this.yesRadio = page.getByLabel('Yes')
    this.noRadio = page.getByLabel('No')
    this.endDateInput = page.getByRole('textbox')
    this.cancelLink = page.getByRole('link', { name: 'Cancel' })
    this.continueButton = page.getByRole('button', { name: 'Continue' })
  }

  static async verifyOnPage(page: Page): Promise<EndDatePage> {
    const endDatePage = new EndDatePage(page)
    await expect(endDatePage.header).toBeVisible()
    await expect(endDatePage.yesRadio).toBeVisible()
    await expect(endDatePage.noRadio).toBeVisible()
    await expect(endDatePage.cancelLink).toBeVisible()
    await expect(endDatePage.continueButton).toBeVisible()
    return endDatePage
  }
}
