import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class AddPrisonerPage extends AbstractPage {
  readonly header: Locator

  readonly searchBox: Locator

  readonly searchButton: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Who do you want to add?' })
    this.searchBox = page.getByTestId('query')
    this.searchButton = page.getByRole('button', { name: 'Search' })
  }

  static async verifyOnPage(page: Page): Promise<AddPrisonerPage> {
    const addPrisonerPage = new AddPrisonerPage(page)
    await expect(addPrisonerPage.header).toBeVisible()
    await expect(addPrisonerPage.searchBox).toBeVisible()
    await expect(addPrisonerPage.searchButton).toBeVisible()
    return addPrisonerPage
  }
}
