import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class PayAmountPage extends AbstractPage {
  readonly header: Locator

  readonly payAmountInput: Locator

  readonly continueButton: Locator

  readonly cancelLink: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Enter the new amount' })
    this.payAmountInput = page.locator('#payAmount')
    this.continueButton = page.locator('button', { hasText: 'Continue' })
    this.cancelLink = page.locator('a', { hasText: 'Cancel' })
  }

  static async verifyOnPage(page: Page): Promise<PayAmountPage> {
    const payAmountPage = new PayAmountPage(page)
    await expect(payAmountPage.header).toBeVisible()
    await expect(payAmountPage.payAmountInput).toBeVisible()
    await expect(payAmountPage.continueButton).toBeVisible()
    await expect(payAmountPage.cancelLink).toBeVisible()
    return payAmountPage
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
