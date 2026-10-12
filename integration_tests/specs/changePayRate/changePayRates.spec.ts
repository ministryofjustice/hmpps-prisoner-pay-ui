import { expect, test } from '@playwright/test'
import { getMatchingRequests } from '../../mockApis/wiremock'
import { login, resetStubs } from '../../testUtils'
import DashboardPage from '../../pages/dashboard/dashboardPage'
import PayRatesPage from '../../pages/dashboard/payRatesPage'
import payOrchestratorApi from '../../mockApis/payOrchestratorApi'
import prisonerPayApi from '../../mockApis/prisonerPayApi'
import PayOverviewPage from '../../pages/dashboard/payOverviewPage'
import PayAmountPage from '../../pages/changePayRate/payAmountPage'
import SetChangeDatePage from '../../pages/changePayRate/setChangeDatePage'
import CheckPayRatePage from '../../pages/changePayRate/checkPayRatePage'

test.describe('Change Pay Rate', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Can change a pay type pay rate', async ({ page }) => {
    await payOrchestratorApi.stubPayOrchestratorHealthPing()
    await payOrchestratorApi.stubGetPayStatusPeriods()
    await payOrchestratorApi.stubGetPayRatesByPrison()
    await prisonerPayApi.stubPrisonerPayHealthPing()
    await prisonerPayApi.stubPatchPayRate()

    const type = 'Long-term sick'
    await login(page)

    const dashboardPage = await DashboardPage.verifyOnPage(page)
    expect(dashboardPage.header).toBeDefined()
    await dashboardPage.getTypeLink(type).click()

    const payOverviewPage = await PayOverviewPage.verifyOnPage(page, type)
    expect(payOverviewPage.header).toBeDefined()
    await expect(page.getByText("They're paid £0.65 per day (£3.25 for a 5 day week)")).toBeVisible()
    await payOverviewPage.changePayRateLink.click()

    const payRatesPage = await PayRatesPage.verifyOnPage(page)
    await expect(payRatesPage.payTypeSummaryCards).toContainText('£3.25 per week')
    await payRatesPage.payTypeSummaryCards.locator('a', { hasText: 'Change amount' }).click()

    const payAmountPage = await PayAmountPage.verifyOnPage(page)
    await expect(page.getByText('Long-term sick pay must be at least £0.65 per day (£3.25 per week).')).toBeVisible()
    await payAmountPage.enterPayAmount('2.00')
    await payAmountPage.clickContinue()

    const setChangeDatePage = await SetChangeDatePage.verifyOnPage(page)
    await setChangeDatePage.selectTomorrow()
    await setChangeDatePage.clickContinue()

    const checkPayRatePage = await CheckPayRatePage.verifyOnPage(page)
    expect(checkPayRatePage.header).toBeDefined()

    await expect(page.getByText('£2 per day', { exact: true })).toBeVisible()
    await checkPayRatePage.confirmPayChange()
    await PayRatesPage.verifyOnPage(page)
    const requests = await getMatchingRequests({ method: 'PUT', urlPattern: '/prisoner-pay-api/pay-rates/.*' })
    expect(requests.body.requests).toHaveLength(1)
    expect(JSON.parse(requests.body.requests[0].body).rate).toBe(200)
  })
})
