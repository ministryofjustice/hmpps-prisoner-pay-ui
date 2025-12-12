import { type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class AddPrisonerPage extends AbstractPage {
  readonly header: Locator

  readonly searchBox: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Who do you want to add?' })
    this.searchBox = page.getByTestId('query')
  }
}
