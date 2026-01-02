import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../../testUtils'
import DashboardPage from '../../pages/dashboard/dashboardPage'

test.describe('Dashboard', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Can visit the dashboard page', async ({ page }) => {
    await login(page)

    const dashboardPage = await DashboardPage.verifyOnPage(page)
    expect(dashboardPage.header).toBeDefined()
    // TODO: Further tests once API properly integrated
  })
})
