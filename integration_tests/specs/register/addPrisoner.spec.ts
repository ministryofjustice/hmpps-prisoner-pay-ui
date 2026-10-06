import { expect, test } from '@playwright/test'
import { addDays, format } from 'date-fns'
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
import { getMatchingRequests } from '../../mockApis/wiremock'

test.describe('Add prisoner - Long-term sick', () => {
  const type = 'Long-term sick'

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

    await expect(
      page.getByRole('heading', { name: 'When is Nicaigh Johnustine’s first day on this status?' }),
    ).toBeVisible()
    await page.getByRole('radio', { name: /^Today -/ }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

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
    await expect(page.locator('.govuk-panel__body')).toHaveText(
      'Nicaigh Johnustine (G4529UP) will receive long-term sick pay from today',
    )
  })

  test('Can add a prisoner to a pay type - set end date', async ({ page }) => {
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

    await expect(
      page.getByRole('heading', { name: 'When is Nicaigh Johnustine’s first day on this status?' }),
    ).toBeVisible()
    await page.getByRole('radio', { name: /^Today -/ }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

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
    await expect(page.locator('.govuk-panel__body')).toHaveText(
      'Nicaigh Johnustine (G4529UP) will receive long-term sick pay from today',
    )
  })

  test('Can cancel adding a prisoner to a pay type - End date page', async ({ page }) => {
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

    await expect(
      page.getByRole('heading', { name: 'When is Nicaigh Johnustine’s first day on this status?' }),
    ).toBeVisible()
    await page.getByRole('radio', { name: /^Today -/ }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

    const endDatePage = await EndDatePage.verifyOnPage(page)
    await endDatePage.cancelLink.click()

    const cancelPage = await CancelPage.verifyOnPage(page)
    await cancelPage.yesRadio.click()
    await cancelPage.confirmButton.click()

    await PayOverviewPage.verifyOnPage(page, type)
  })

  test('Can cancel adding a prisoner to a pay type - Check page', async ({ page }) => {
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

    await expect(
      page.getByRole('heading', { name: 'When is Nicaigh Johnustine’s first day on this status?' }),
    ).toBeVisible()
    await page.getByRole('radio', { name: /^Today -/ }).check()
    await page.getByRole('button', { name: 'Continue' }).click()

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
  test('Custom start date is preserved and end date must be on or after it', async ({ page }) => {
    const dashboard = await DashboardPage.verifyOnPage(page)
    await dashboard.getTypeLink(type).click()
    const overview = await PayOverviewPage.verifyOnPage(page, type)
    await overview.addPersonButton.click()
    const search = await AddPrisonerPage.verifyOnPage(page)
    await search.searchBox.fill('A1234BC')
    await search.searchButton.click()
    const results = await AddPrisonerResultsPage.verifyOnPage(page)
    await page.getByRole('radio', { name: 'Nicaigh Johnustine' }).check()
    await results.continueButton.click()
    await expect(
      page.getByRole('heading', { name: 'When is Nicaigh Johnustine’s first day on this status?' }),
    ).toBeVisible()
    const continueButton = page.getByRole('button', { name: 'Continue' })
    await expect(page.getByRole('textbox', { name: 'Enter or select the start date' })).toBeHidden()
    await continueButton.click()
    await expect(page.getByRole('alert')).toContainText('Select when this status should start')
    await page.getByLabel('A different future date').check()
    await page.getByRole('textbox', { name: 'Enter or select the start date' }).fill('31/02/2028')
    await continueButton.click()
    await expect(page.getByRole('alert')).toContainText('Enter a real start date')
    await expect(page.getByLabel('A different future date')).toBeChecked()
    await expect(page.getByRole('textbox', { name: 'Enter or select the start date' })).toHaveValue('31/02/2028')

    const start = addDays(new Date(), 7)
    await page.getByRole('textbox', { name: 'Enter or select the start date' }).fill(format(start, 'dd/MM/yyyy'))
    await continueButton.click()
    const end = await EndDatePage.verifyOnPage(page)
    await page.getByRole('link', { name: 'Back', exact: true }).click()
    await expect(page.getByLabel('A different future date')).toBeChecked()
    await expect(page.getByRole('textbox', { name: 'Enter or select the start date' })).toHaveValue(
      format(start, 'dd/MM/yyyy'),
    )
    await continueButton.click()
    await end.yesRadio.check()
    await end.endDateInput.fill(format(addDays(start, -1), 'dd/MM/yyyy'))
    await continueButton.click()
    await expect(page.getByRole('alert')).toContainText('The end date must be on or after the start date')
    await end.endDateInput.fill(format(start, 'dd/MM/yyyy'))
    await continueButton.click()
    const check = await CheckPage.verifyOnPage(page)
    await expect(page.locator('.govuk-summary-list')).toContainText(format(start, 'd MMMM yyyy'))
    await page.getByRole('link', { name: 'Back', exact: true }).click()
    await expect(end.yesRadio).toBeChecked()
    await expect(end.endDateInput).toHaveValue(format(start, 'dd/MM/yyyy'))
    await continueButton.click()
    await check.confirmButton.click()
    await ConfirmedAddPrisonerPage.verifyOnPage(page)
    await expect(page.locator('.govuk-panel__body')).toHaveText(
      `Nicaigh Johnustine (G4529UP) will receive long-term sick pay from ${format(start, 'd MMMM yyyy')}`,
    )
    const requests = await getMatchingRequests({ method: 'POST', url: '/prisoner-pay-api/pay-status-periods' })
    expect(requests.body.requests).toHaveLength(1)
    expect(JSON.parse(requests.body.requests[0].body)).toMatchObject({
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(start, 'yyyy-MM-dd'),
    })
  })
})
