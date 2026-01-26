import { format, isToday, isTomorrow, isYesterday, parse } from 'date-fns'
import { NameFormatStyle } from './helpers/nameFormatStyle'

const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

export type FieldValidationError = {
  href: string
  text: string
}

export const findError = (array: FieldValidationError[], formFieldId: string) => {
  if (!array) return null
  const item = array.find(error => error.href === `#${formFieldId}`)
  if (item) {
    return {
      text: item.text,
    }
  }
  return null
}

/**
 * Format a person's name with proper capitalisation
 *
 * Correctly handles names with apostrophes, hyphens and spaces
 *
 * @param firstName - first name
 * @param middleNames - middle names
 * @param lastName - last name
 * @param nameFormatStyle: how the name is to be formatted,
 * @param boldLastName: whether the last name is bold
 * @returns formatted name string
 */
export const formatName = (
  firstName: string,
  middleNames: string,
  lastName: string,
  nameFormatStyle: NameFormatStyle,
  boldLastName: boolean = true,
): string => {
  const names = [firstName, middleNames, lastName]
  if (nameFormatStyle === NameFormatStyle.lastCommaFirstMiddle) {
    names.unshift(`${names.pop()},`)
  } else if (nameFormatStyle === NameFormatStyle.lastCommaFirst) {
    names.unshift(`${names.pop()},`)
    names.pop() // Remove middleNames
  } else if (nameFormatStyle === NameFormatStyle.firstLast) {
    names.splice(1, 1)
  }
  const namesOrdered = names
    .filter(s => s)
    .map(s => s.toLowerCase().trim())
    .join(' ')
    .replace(/(^\w)|([\s'-]+\w)/g, letter => letter.toUpperCase())

  if (
    boldLastName &&
    (nameFormatStyle === NameFormatStyle.lastCommaFirstMiddle || nameFormatStyle === NameFormatStyle.lastCommaFirst)
  ) {
    const [surname, ...rest] = namesOrdered.split(', ')
    return `<strong>${surname}</strong>, ${rest.join(' ')}`
  }

  return namesOrdered
}

/**
 * Clean wrapper for formatName that formats a name as "First Last" (i.e. first name and last name only).
 *
 * Correctly handles names with apostrophes, hyphens and spaces
 *
 * @param firstName - first name
 * @param lastName - last name
 * @returns formatted name string
 */
export const formatFirstLastName = (firstName: string, lastName: string): string =>
  formatName(firstName, undefined, lastName, NameFormatStyle.firstLast, false)

/**
 * Clean wrapper for formatName that formats a string to title case
 *
 * @param input - string to be formatted
 * @returns formatted string
 */
export const formatStringToTitleCase = (input: string): string =>
  formatName(input, undefined, undefined, NameFormatStyle.firstLast, false)
export const parseDate = (date: string, fromFormat = 'yyyy-MM-dd') => {
  if (!date) return null
  return parse(date, fromFormat, new Date())
}

export const formatDate = (date: unknown, fmt = 'EEEE, d MMMM yyyy', inContextName = false) => {
  if (!date) return null

  let richDate = date as Date
  if (typeof date === 'string') {
    richDate = parseDate(date as string)
  }

  if (inContextName) {
    if (isToday(richDate)) {
      return 'today'
    }
    if (isTomorrow(richDate)) {
      return 'tomorrow'
    }
    if (isYesterday(richDate)) {
      return 'yesterday'
    }
  }
  return format(richDate, fmt)
}

export const toFixed = (num: number, decimals = 2) => {
  if (!num && num !== 0) return null
  return num.toFixed(decimals)
}
