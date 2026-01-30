import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../../testUtils'
import DashboardPage from '../../pages/dashboard/dashboardPage'
import payOrchestratorApi from '../../mockApis/payOrchestratorApi'

test.describe('Dashboard', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Can visit the dashboard page', async ({ page }) => {
    await payOrchestratorApi.stubGetPayStatusPeriods()
    await login(page)

    const dashboardPage = await DashboardPage.verifyOnPage(page)
    expect(dashboardPage.header).toBeDefined()
  })
})
