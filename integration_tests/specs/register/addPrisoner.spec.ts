import { expect, test } from '@playwright/test'
import { login, resetStubs } from '../../testUtils'
import DashboardPage from '../../pages/dashboard/dashboardPage'
import PayOverviewPage from '../../pages/dashboard/payOverviewPage'
import AddPrisonerPage from '../../pages/register/addPrisonerPage'
import AddPrisonerResultsPage from '../../pages/register/addPrisonerResultsPage'
import EndDatePage from '../../pages/register/endDatePage'
import CheckPage from '../../pages/register/checkPage'
import ConfirmedAddPrisonerPage from '../../pages/register/confirmedAddPrisonerPage'

test.describe('Dashboard', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Can visit the dashboard page', async ({ page }) => {
    const type = 'Long-term sick'
    await login(page)

    const dashboardPage = await DashboardPage.verifyOnPage(page)
    await dashboardPage.getTypeLink(type).click()

    const payOverviewPage = await PayOverviewPage.verifyOnPage(page, type)
    await payOverviewPage.addPersonButton.click()

    const addPrisonerPage = await AddPrisonerPage.verifyOnPage(page)
    await addPrisonerPage.searchBox.fill('A1234BC')
    await addPrisonerPage.searchButton.click()

    const addPrisonerResultsPage = await AddPrisonerResultsPage.verifyOnPage(page)
    await addPrisonerResultsPage.page.getByRole('radio', { name: 'Nicaigh Johnustine' }).check()
    await addPrisonerResultsPage.continueButton.click()

    const endDatePage = await EndDatePage.verifyOnPage(page)
    await endDatePage.noRadio.click()
    await endDatePage.continueButton.click()

    const checkPage = await CheckPage.verifyOnPage(page)
    await checkPage.confirmButton.click()

    const confirmedAddPrisonerPage = await ConfirmedAddPrisonerPage.verifyOnPage(page)
    await expect(confirmedAddPrisonerPage.header).toBeVisible()
  })
})
