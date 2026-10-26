import { isSameDay, parseISO } from 'date-fns'
import { StatusDefinition } from '../../../statuses/types'
import { formatDate, formatFirstLastName } from '../../../utils/utils'
import { RegisterConfirmation } from '../journey'

export default function buildConfirmationPage(
  status: StatusDefinition,
  context: { confirmation: RegisterConfirmation; today: Date; activitiesUiUrl: string },
) {
  const { prisoner, startDate } = context.confirmation
  const content = status.confirmation
  const values = {
    prisonerName: formatFirstLastName(prisoner.firstName, prisoner.lastName),
    prisonerNumber: prisoner.prisonerNumber,
    startDateText: isSameDay(parseISO(startDate), context.today)
      ? content.todayText
      : formatDate(startDate, 'd MMMM yyyy'),
  }
  const destinations = {
    prisonerAllocations: `${context.activitiesUiUrl}/prisoner-allocations/${prisoner.prisonerNumber}`,
    newRegistration: '../register/new',
  }

  return {
    pageTitleSuffix: content.pageTitle,
    confirmation: {
      titleText: content.titleText,
      text: content.text(values),
      nextSteps: content.nextSteps.map(link => ({ text: link.text(values), href: destinations[link.destination] })),
    },
  }
}
