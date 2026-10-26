import { addDays, isSameDay, parseISO } from 'date-fns'
import { CheckDefinition, StatusDefinition } from '../../../statuses/types'
import { formatDate, formatFirstLastName } from '../../../utils/utils'
import { RegisterJourney } from '../journey'

const formatCheckDate = (date: string, content: CheckDefinition, today: Date): string => {
  const parsedDate = parseISO(date)
  const fullDate = formatDate(date, 'd MMMM yyyy')
  if (isSameDay(parsedDate, today)) return `${content.dateLabels.today} - ${fullDate}`
  if (isSameDay(parsedDate, addDays(today, 1))) return `${content.dateLabels.tomorrow} - ${fullDate}`
  return fullDate
}

export default function buildCheckPage(status: StatusDefinition, context: { journey: RegisterJourney; today: Date }) {
  const { journey, today } = context
  const { prisoner, startDate, endDate } = journey
  const content = status.check
  const prisonerName = formatFirstLastName(prisoner.firstName, prisoner.lastName)

  return {
    pageTitleSuffix: content.pageTitle,
    heading: content.heading,
    previousPage: endDate ? 'last-day' : 'end-date',
    summaryList: {
      rows: [
        {
          key: { text: content.labels.prisoner },
          value: { text: prisonerName },
          actions: {
            items: [
              {
                href: 'add-prisoner',
                classes: 'govuk-link--no-visited-state',
                text: content.changeLinkText,
                visuallyHiddenText: content.changeDescriptions.prisoner,
              },
            ],
          },
        },
        {
          key: { text: content.labels.startDate },
          value: { text: formatCheckDate(startDate, content, today) },
          actions: {
            items: [
              {
                href: 'start-date',
                text: content.changeLinkText,
                visuallyHiddenText: content.changeDescriptions.startDate,
              },
            ],
          },
        },
        {
          key: { text: content.labels.endDate },
          value: { text: endDate ? formatCheckDate(endDate, content, today) : content.noEndDateText },
          actions: {
            items: [
              {
                href: 'end-date',
                classes: 'govuk-link--no-visited-state',
                text: content.changeLinkText,
                visuallyHiddenText: content.changeDescriptions.endDate,
              },
            ],
          },
        },
      ],
    },
    confirmButtonText: content.confirmButtonText,
    cancelLinkText: content.cancelLinkText,
  }
}
