import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../../testUtils'
import EditPayHomepage from '../../pages/editPay/homepage'
import payOrchestratorApi from '../../mockApis/payOrchestratorApi'
import PayRatesPage from '../../pages/dashboard/payRatesPage'

test.describe('Edit pay homepage', () => {
  const card = 'Pay rates for people not in work'

  test.beforeEach(async ({ page }) => {
    await payOrchestratorApi.stubGetPayStatusPeriods()
    await login(page)
    await page.goto('/edit-pay')
  })
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Can visit the `pay rates` page', async ({ page }) => {
    const editPayHomepage = await EditPayHomepage.verifyOnPage(page)
    expect(editPayHomepage.header).toBeDefined()
    await editPayHomepage.getTypeLink(card).click()

    PayRatesPage.verifyOnPage(page)
  })
})
