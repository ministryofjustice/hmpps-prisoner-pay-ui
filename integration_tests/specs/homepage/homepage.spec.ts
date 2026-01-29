import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../../testUtils'
import Homepage from '../../pages/homepage/homepage'

test.describe('Homepage', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Can visit the `Homepage` page', async ({ page }) => {
    await login(page)

    const homepage = await Homepage.verifyOnPage(page)
    expect(homepage.header).toBeDefined()
  })
})
