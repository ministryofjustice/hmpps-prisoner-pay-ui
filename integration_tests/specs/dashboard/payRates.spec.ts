import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../../testUtils'
import DashboardPage from '../../pages/dashboard/dashboardPage'
import Homepage from '../../pages/homepage/homepage'
import PayRatesPage from '../../pages/dashboard/payRatesPage'
import payOrchestratorApi from '../../mockApis/payOrchestratorApi'
import PayOverviewPage from '../../pages/dashboard/payOverviewPage'

test.describe('Dashboard', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Can visit the pay rates page', async ({ page }) => {
    await payOrchestratorApi.stubGetPayStatusPeriods()

    const card = 'Pay rates for people not in work'
    const type = 'Long-term sick'
    await login(page)

    const homepage = await Homepage.verifyOnPage(page)

    await homepage.getTypeLink(card).click()

    const dashboardPage = await DashboardPage.verifyOnPage(page)

    await dashboardPage.getTypeLink(type).click()

    const payOverviewPage = await PayOverviewPage.verifyOnPage(page, type)

    await payOverviewPage.changePayRateLink.click()

    const payRatesPage = await PayRatesPage.verifyOnPage(page)
    expect(payRatesPage.header).toBeDefined()
  })
})
