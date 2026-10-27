import { expect, test } from '@playwright/test'
import TestData from '../../../server/testutils/testData'
import { getMatchingRequests } from '../../mockApis/wiremock'
import { login, resetStubs } from '../../testUtils'
import PayRatesPage from '../../pages/dashboard/payRatesPage'
import payOrchestratorApi from '../../mockApis/payOrchestratorApi'
import prisonerPayApi from '../../mockApis/prisonerPayApi'
import PayAmountPage from '../../pages/changePayRate/payAmountPage'
import SetChangeDatePage from '../../pages/changePayRate/setChangeDatePage'
import CheckPayRatePage from '../../pages/changePayRate/checkPayRatePage'

test.describe('Change Pay Rate', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  for (const [type, slug, payType] of [
    ['Long-term sick', 'long-term-sick', 'LONG_TERM_SICK'],
    ['Short-term sick', 'short-term-sick', 'SHORT_TERM_SICK'],
  ]) {
    test(`Can change the ${type} pay rate`, async ({ page }) => {
      await payOrchestratorApi.stubPayOrchestratorHealthPing()
      await payOrchestratorApi.stubGetPayStatusPeriods()
      await payOrchestratorApi.stubGetPayRatesByPrison('.*', 200, [
        ...TestData.PayRates(),
        { ...TestData.PayRate(), id: 'short-term-rate-id', type: 'SHORT_TERM_SICK', rate: 325 },
      ])
      await prisonerPayApi.stubPrisonerPayHealthPing()
      await prisonerPayApi.stubPatchPayRate()

      await login(page)
      await page.goto('/pay-rates')
      const payRatesPage = await PayRatesPage.verifyOnPage(page)
      const card = payRatesPage.payTypeSummaryCards.filter({ hasText: type })
      await expect(card).toContainText('£3.25 per week')
      await card.locator('a', { hasText: 'Change amount' }).click()
      await expect(page).toHaveURL(new RegExp(`/${slug}/change-pay-rate/pay-amount$`))

      const payAmountPage = await PayAmountPage.verifyOnPage(page)
      await expect(page.getByText(`${type} pay must be at least £0.65 per day (£3.25 per week).`)).toBeVisible()
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
      expect(requests.body.requests[0].url).toContain(
        payType === 'SHORT_TERM_SICK' ? 'short-term-rate-id' : TestData.PayRates()[0].id,
      )
      await expect(page.getByText(`You've updated the pay for ${type}.`, { exact: false })).toBeVisible()
    })
  }
})
