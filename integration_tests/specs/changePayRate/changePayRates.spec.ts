import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../../testUtils'
import DashboardPage from '../../pages/dashboard/dashboardPage'
import PayRatesPage from '../../pages/dashboard/payRatesPage'
import payOrchestratorApi from '../../mockApis/payOrchestratorApi'
import PayOverviewPage from '../../pages/dashboard/payOverviewPage'

test.describe('Dashboard', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Can change a pay type pay rate', async ({ page }) => {
    await payOrchestratorApi.stubGetPayStatusPeriods()

    const type = 'Long-term sick'
    await login(page)

    const dashboardPage = await DashboardPage.verifyOnPage(page)
    expect(dashboardPage.header).toBeDefined()

    await dashboardPage.getTypeLink(type).click()

    const payOverviewPage = await PayOverviewPage.verifyOnPage(page, type)
    expect(payOverviewPage.header).toBeDefined()

    const payRatesPage = await PayRatesPage.verifyOnPage(page)
    expect(payRatesPage.header).toBeDefined()
  })
})
