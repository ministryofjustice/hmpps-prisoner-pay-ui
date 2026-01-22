import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class SetChangeDatePage extends AbstractPage {
  readonly header: Locator

  readonly tomorrowRadio: Locator

  readonly anotherDateRadio: Locator

  readonly changeDateInput: Locator

  readonly continueButton: Locator

  readonly cancelLink: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'When do you want the change to take effect?' })
    this.tomorrowRadio = page.locator('input[value="tomorrow"]')
    this.anotherDateRadio = page.locator('input[value="other"]')
    this.changeDateInput = page.locator('#changeDate')
    this.continueButton = page.locator('button', { hasText: 'Continue' })
    this.cancelLink = page.locator('a', { hasText: 'Cancel' })
  }

  static async verifyOnPage(page: Page): Promise<SetChangeDatePage> {
    const setChangeDatePage = new SetChangeDatePage(page)
    await expect(setChangeDatePage.header).toBeVisible()
    await expect(setChangeDatePage.tomorrowRadio).toBeVisible()
    await expect(setChangeDatePage.anotherDateRadio).toBeVisible()
    await expect(setChangeDatePage.continueButton).toBeVisible()
    await expect(setChangeDatePage.cancelLink).toBeVisible()
    return setChangeDatePage
  }

  async selectTomorrow(): Promise<void> {
    await this.tomorrowRadio.click()
  }

  async selectAnotherDate(): Promise<void> {
    await this.anotherDateRadio.click()
  }

  async enterChangeDate(date: string): Promise<void> {
    await this.changeDateInput.fill(date)
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click()
  }

  async clickCancel(): Promise<void> {
    await this.cancelLink.click()
  }
}
