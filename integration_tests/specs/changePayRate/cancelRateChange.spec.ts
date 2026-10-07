import { expect, test } from '@playwright/test'
import TestData from '../../../server/testutils/testData'
import { login, resetStubs } from '../../testUtils'
import DashboardPage from '../../pages/dashboard/dashboardPage'
import PayRatesPage from '../../pages/dashboard/payRatesPage'
import prisonerPayApi from '../../mockApis/prisonerPayApi'
import payOrchestratorApi from '../../mockApis/payOrchestratorApi'
import PayOverviewPage from '../../pages/dashboard/payOverviewPage'
import CancelRateChangePage from '../../pages/changePayRate/cancelRateChangePage'

test.describe('Change Pay Rate', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Can cancel a scheduled pay rate change', async ({ page }) => {
    await payOrchestratorApi.stubPayOrchestratorHealthPing()
    await payOrchestratorApi.stubGetPayStatusPeriods()
    await payOrchestratorApi.stubGetPayRatesByPrison('.*', 200, [
      ...TestData.PayRates(),
      { ...TestData.PayRate(), id: 'f7a138e6-7f9e-4336-8494-890d6b3d0a97', startDate: '2999-01-01' },
    ])
    await prisonerPayApi.stubDeleteFuturePayRate()

    const type = 'Long-term sick'
    await login(page)

    const dashboardPage = await DashboardPage.verifyOnPage(page)
    expect(dashboardPage.header).toBeDefined()

    await dashboardPage.getTypeLink(type).click()

    const payOverviewPage = await PayOverviewPage.verifyOnPage(page, type)
    expect(payOverviewPage.header).toBeDefined()
    await payOverviewPage.changePayRateLink.click()

    const payRatesPage = await PayRatesPage.verifyOnPage(page)
    const cancelLink = payRatesPage.payTypeSummaryCards.locator('a', { hasText: 'Cancel change' })
    await expect(cancelLink).toHaveAttribute(
      'href',
      '../long-term-sick/change-pay-rate/f7a138e6-7f9e-4336-8494-890d6b3d0a97/cancel-rate-change',
    )
    await cancelLink.click()

    const cancelRateChangePage = await CancelRateChangePage.verifyOnPage(page)
    await cancelRateChangePage.yesRadio.check()
    await cancelRateChangePage.confirmButton.click()

    const payRatesPageAfterCancel = await PayRatesPage.verifyOnPage(page)
    expect(payRatesPageAfterCancel.notificationBanner).toBeVisible()
  })
})
