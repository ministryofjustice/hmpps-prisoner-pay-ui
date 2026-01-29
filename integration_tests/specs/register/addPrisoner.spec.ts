import { expect, test } from '@playwright/test'
import { format } from 'date-fns'
import { login, resetStubs } from '../../testUtils'
import DashboardPage from '../../pages/dashboard/dashboardPage'
import PayOverviewPage from '../../pages/dashboard/payOverviewPage'
import AddPrisonerPage from '../../pages/register/addPrisonerPage'
import AddPrisonerResultsPage from '../../pages/register/addPrisonerResultsPage'
import EndDatePage from '../../pages/register/endDatePage'
import CancelPage from '../../pages/register/cancelPage'
import CheckPage from '../../pages/register/checkPage'
import ConfirmedAddPrisonerPage from '../../pages/register/confirmedAddPrisonerPage'
import payOrchestratorApi from '../../mockApis/payOrchestratorApi'
import prisonerPayApi from '../../mockApis/prisonerPayApi'
import Homepage from '../../pages/homepage/homepage'

test.describe('Add prisoner - Long-term sick', () => {
  const type = 'Long-term sick'
  const card = 'Pay rates for people not in work'

  test.beforeEach(async ({ page }) => {
    await payOrchestratorApi.stubGetPayStatusPeriods()
    await payOrchestratorApi.stubSearchPrisoners()
    await prisonerPayApi.stubPostPayStatusPeriod()
    await login(page)
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Can add a prisoner to a pay type - no end date', async ({ page }) => {
    const homepage = await Homepage.verifyOnPage(page)
    await homepage.getTypeLink(card).click()

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
    await endDatePage.cancelLink.click()

    const cancelPage = await CancelPage.verifyOnPage(page)
    await cancelPage.noRadio.click()
    await cancelPage.confirmButton.click()

    await EndDatePage.verifyOnPage(page)
    await endDatePage.noRadio.click()
    await endDatePage.continueButton.click()

    const checkPage = await CheckPage.verifyOnPage(page)
    await checkPage.confirmButton.click()

    const confirmedAddPrisonerPage = await ConfirmedAddPrisonerPage.verifyOnPage(page)
    await expect(confirmedAddPrisonerPage.header).toBeVisible()
  })

  test('Can add a prisoner to a pay type - set end date', async ({ page }) => {
    const homepage = await Homepage.verifyOnPage(page)
    await homepage.getTypeLink(card).click()

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
    await endDatePage.yesRadio.click()

    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)
    const formattedDate = format(futureDate, 'dd/MM/yyyy')
    await endDatePage.endDateInput.fill(formattedDate)
    await endDatePage.continueButton.click()

    const checkPage = await CheckPage.verifyOnPage(page)
    await checkPage.cancelLink.click()

    const cancelPage = await CancelPage.verifyOnPage(page)
    await cancelPage.noRadio.click()
    await cancelPage.confirmButton.click()

    await CheckPage.verifyOnPage(page)
    await checkPage.confirmButton.click()

    const confirmedAddPrisonerPage = await ConfirmedAddPrisonerPage.verifyOnPage(page)
    await expect(confirmedAddPrisonerPage.header).toBeVisible()
  })

  test('Can cancel adding a prisoner to a pay type - End date page', async ({ page }) => {
    const homepage = await Homepage.verifyOnPage(page)
    await homepage.getTypeLink(card).click()

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
    await endDatePage.cancelLink.click()

    const cancelPage = await CancelPage.verifyOnPage(page)
    await cancelPage.yesRadio.click()
    await cancelPage.confirmButton.click()

    await PayOverviewPage.verifyOnPage(page, type)
  })

  test('Can cancel adding a prisoner to a pay type - Check page', async ({ page }) => {
    const homepage = await Homepage.verifyOnPage(page)
    await homepage.getTypeLink(card).click()

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
    await checkPage.cancelLink.click()

    const cancelPage = await CancelPage.verifyOnPage(page)
    await cancelPage.yesRadio.click()
    await cancelPage.confirmButton.click()

    await PayOverviewPage.verifyOnPage(page, type)
  })
})
