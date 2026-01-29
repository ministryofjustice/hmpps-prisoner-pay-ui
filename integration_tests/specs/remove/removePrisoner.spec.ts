import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../../testUtils'
import DashboardPage from '../../pages/dashboard/dashboardPage'
import PayOverviewPage from '../../pages/dashboard/payOverviewPage'
import RemovalDatePage from '../../pages/remove/removalDatePage'
import CheckRemovalDatePage from '../../pages/remove/checkRemovalDatePage'
import ConfirmedRemovalDatePage from '../../pages/remove/confirmedRemovalDatePage'
import payOrchestratorApi from '../../mockApis/payOrchestratorApi'
import prisonerPayApi from '../../mockApis/prisonerPayApi'
import Homepage from '../../pages/homepage/homepage'

test.describe('Remove Prisoner', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Can remove a prisoner from a pay type', async ({ page }) => {
    await payOrchestratorApi.stubGetPayStatusPeriods()
    await prisonerPayApi.stubPatchPayStatusPeriod()

    const card = 'Pay rates for people not in work'
    const type = 'Long-term sick'
    await login(page)

    const homepage = await Homepage.verifyOnPage(page)
    await homepage.getTypeLink(card).click()

    const dashboardPage = await DashboardPage.verifyOnPage(page)
    await dashboardPage.getTypeLink(type).click()

    const payOverviewPage = await PayOverviewPage.verifyOnPage(page, type)

    const removeLink = payOverviewPage.getRemoveLink(type)
    await removeLink.first().click()

    const removalDatePage = await RemovalDatePage.verifyOnPage(page)
    await removalDatePage.todayRadio.click()
    await removalDatePage.continueButton.click()

    const checkRemovalDatePage = await CheckRemovalDatePage.verifyOnPage(page)
    await checkRemovalDatePage.confirmButton.click()

    const confirmedRemovalDatePage = await ConfirmedRemovalDatePage.verifyOnPage(page)
    await expect(confirmedRemovalDatePage.header).toBeVisible()
  })
})
