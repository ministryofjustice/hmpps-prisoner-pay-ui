import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../../testUtils'
import DashboardPage from '../../pages/dashboard/dashboardPage'
import PayRatesPage from '../../pages/dashboard/payRatesPage'
import payOrchestratorApi from '../../mockApis/payOrchestratorApi'
import PayOverviewPage from '../../pages/dashboard/payOverviewPage'
import PayAmountPage from '../../pages/changePayRate/payAmountPage'
import SetChangeDatePage from '../../pages/changePayRate/setChangeDatePage'
import CheckPayRatePage from '../../pages/changePayRate/checkPayRatePage'
import Homepage from '../../pages/homepage/homepage'

test.describe('Change Pay Rate', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Can change a pay type pay rate', async ({ page }) => {
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
    await payRatesPage.payTypeSummaryCards.locator('a', { hasText: 'Change' }).click()

    const payAmountPage = await PayAmountPage.verifyOnPage(page)
    await payAmountPage.enterPayAmount('2.00')
    await payAmountPage.clickContinue()

    const setChangeDatePage = await SetChangeDatePage.verifyOnPage(page)
    await setChangeDatePage.selectTomorrow()
    await setChangeDatePage.clickContinue()

    const checkPayRatePage = await CheckPayRatePage.verifyOnPage(page)
    expect(checkPayRatePage.header).toBeDefined()

    await checkPayRatePage.confirmPayChange()
    await PayRatesPage.verifyOnPage(page)
  })
})
