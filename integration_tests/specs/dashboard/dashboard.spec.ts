import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../../testUtils'
import DashboardPage from '../../pages/dashboard/dashboardPage'
import Homepage from '../../pages/homepage/homepage'
import payOrchestratorApi from '../../mockApis/payOrchestratorApi'

test.describe('Dashboard', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Can visit the dashboard page', async ({ page }) => {
    await payOrchestratorApi.stubGetPayStatusPeriods()

    const card = 'Pay rates for people not in work'
    await login(page)

    const homepage = await Homepage.verifyOnPage(page)

    await homepage.getTypeLink(card).click()

    const dashboardPage = await DashboardPage.verifyOnPage(page)
    expect(dashboardPage.header).toBeDefined()
  })
})
