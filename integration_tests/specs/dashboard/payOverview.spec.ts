import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../../testUtils'
import DashboardPage from '../../pages/dashboard/dashboardPage'
import Homepage from '../../pages/homepage/homepage'
import PayOverviewPage from '../../pages/dashboard/payOverviewPage'
import payOrchestratorApi from '../../mockApis/payOrchestratorApi'

test.describe('Dashboard', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Can visit the pay overview page', async ({ page }) => {
    await payOrchestratorApi.stubGetPayStatusPeriods()

    const card = 'Pay rates for people not in work'
    const type = 'Long-term sick'
    await login(page)

    const homepage = await Homepage.verifyOnPage(page)

    await homepage.getTypeLink(card).click()

    const dashboardPage = await DashboardPage.verifyOnPage(page)

    await dashboardPage.getTypeLink(type).click()

    const payOverviewPage = await PayOverviewPage.verifyOnPage(page, type)
    expect(payOverviewPage.header).toBeDefined()
  })
})
