import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../../testUtils'
import DashboardPage from '../../pages/dashboard/dashboardPage'
import PayRatesPage from '../../pages/dashboard/payRatesPage'
import payOrchestratorApi from '../../mockApis/payOrchestratorApi'
import PayOverviewPage from '../../pages/dashboard/payOverviewPage'
import CancelRateChangePage from '../../pages/changePayRate/cancelRateChangePage'
import Homepage from '../../pages/homepage/homepage'

test.describe('Change Pay Rate', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Can cancel a scheduled pay rate change', async ({ page }) => {
    await payOrchestratorApi.stubGetPayStatusPeriods()

    const card = 'Pay rates for people not in work'
    const type = 'Long-term sick'
    await login(page)

    const homepage = await Homepage.verifyOnPage(page)
    await homepage.getTypeLink(card).click()

    const dashboardPage = await DashboardPage.verifyOnPage(page)
    expect(dashboardPage.header).toBeDefined()

    await dashboardPage.getTypeLink(type).click()

    const payOverviewPage = await PayOverviewPage.verifyOnPage(page, type)
    expect(payOverviewPage.header).toBeDefined()
    await payOverviewPage.changePayRateLink.click()

    const payRatesPage = await PayRatesPage.verifyOnPage(page)
    await payRatesPage.payTypeSummaryCards.locator('a', { hasText: 'Cancel change' }).click()

    const cancelRateChangePage = await CancelRateChangePage.verifyOnPage(page)
    await cancelRateChangePage.yesRadio.check()
    await cancelRateChangePage.confirmButton.click()

    const payRatesPageAfterCancel = await PayRatesPage.verifyOnPage(page)
    expect(payRatesPageAfterCancel.notificationBanner).toBeVisible()
  })
})
