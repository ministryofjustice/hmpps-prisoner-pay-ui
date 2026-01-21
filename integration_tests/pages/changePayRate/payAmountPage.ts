import { type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class PayAmountPage extends AbstractPage {
  readonly payAmountInput: Locator

  readonly continueButton: Locator

  readonly cancelLink: Locator

  private constructor(page: Page) {
    super(page)
    this.payAmountInput = page.locator('#payAmount')
    this.continueButton = page.locator('button', { hasText: 'Continue' })
    this.cancelLink = page.locator('a', { hasText: 'Cancel' })
  }

  async enterPayAmount(amount: string): Promise<void> {
    await this.payAmountInput.fill(amount)
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click()
  }

  async clickCancel(): Promise<void> {
    await this.cancelLink.click()
  }
}
