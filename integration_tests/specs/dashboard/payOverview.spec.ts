import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../../testUtils'
import DashboardPage from '../../pages/dashboard/dashboardPage'
import PayOverviewPage from '../../pages/dashboard/payOverviewPage'
import payOrchestratorApi from '../../mockApis/payOrchestratorApi'

test.describe('Dashboard', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Can visit the pay overview page', async ({ page }) => {
    await payOrchestratorApi.stubGetPayStatusPeriods()

    const type = 'Long-term sick'
    await login(page)

    const dashboardPage = await DashboardPage.verifyOnPage(page)

    await dashboardPage.getTypeLink(type).click()

    const payOverviewPage = await PayOverviewPage.verifyOnPage(page, type)
    expect(payOverviewPage.header).toBeDefined()
  })
})
