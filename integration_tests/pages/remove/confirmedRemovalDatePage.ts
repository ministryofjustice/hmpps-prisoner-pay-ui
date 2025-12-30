import { type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class ConfirmedRemovalDatePage extends AbstractPage {
  readonly header: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Removal complete' })
  }
}
