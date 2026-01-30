import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class EditPayHomepage extends AbstractPage {
  readonly header: Locator

  readonly typeList: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Edit pay settings' })
    this.typeList = page.getByTestId('edit_pay_homepage')
  }

  static async verifyOnPage(page: Page): Promise<EditPayHomepage> {
    const editPayHomepage = new EditPayHomepage(page)
    await expect(editPayHomepage.header).toBeVisible()
    await expect(editPayHomepage.typeList).toBeVisible()
    return editPayHomepage
  }

  getTypeLink(linkText: string): Locator {
    return this.typeList.getByRole('link', { name: linkText })
  }
}
