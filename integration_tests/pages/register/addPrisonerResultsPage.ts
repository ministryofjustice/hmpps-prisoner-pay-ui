import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class AddPrisonerResultsPage extends AbstractPage {
  readonly header: Locator

  readonly searchBox: Locator

  readonly searchButton: Locator

  readonly resultsTable: Locator

  readonly continueButton: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Who do you want to add?' })
    this.searchBox = page.getByTestId('query')
    this.searchButton = page.getByRole('button', { name: 'Search' })
    this.resultsTable = page.getByTestId('prisoner-search-results-table')
    this.continueButton = page.getByRole('button', { name: 'Continue' })
  }

  static async verifyOnPage(page: Page): Promise<AddPrisonerResultsPage> {
    const addPrisonerResultsPage = new AddPrisonerResultsPage(page)
    await expect(addPrisonerResultsPage.header).toBeVisible()
    await expect(addPrisonerResultsPage.searchBox).toBeVisible()
    await expect(addPrisonerResultsPage.searchButton).toBeVisible()
    await expect(addPrisonerResultsPage.resultsTable).toBeVisible()
    return addPrisonerResultsPage
  }
}
