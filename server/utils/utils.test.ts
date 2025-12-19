import { addDays, subDays } from 'date-fns'
import { NameFormatStyle } from './helpers/nameFormatStyle'
import { convertToTitleCase, formatFirstLastName, formatName, formatDate, initialiseName, parseDate } from './utils'

describe('convert to title case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'robert', 'Robert'],
    ['Upper case', 'ROBERT', 'Robert'],
    ['Mixed case', 'RoBErT', 'Robert'],
    ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
    ['Leading spaces', '  RobeRT', '  Robert'],
    ['Trailing spaces', 'RobeRT  ', 'Robert  '],
    ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('initialise name', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
  ])('%s initialiseName(%s, %s)', (_: string, a: string, expected: string) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

describe('formatName', () => {
  it.each([
    ['All names (LastCommaFirst)', 'John', undefined, 'Smith', NameFormatStyle.lastCommaFirst, false, 'Smith, John'],
    [
      'Double barrelled last name (LastCommaFirst)',
      'Jane',
      undefined,
      'Smith-Doe',
      NameFormatStyle.lastCommaFirst,
      true,
      '<strong>Smith-Doe</strong>, Jane',
    ],
    [
      'Multiple last names without hyphen (LastCommaFirst)',
      'Jane',
      undefined,
      'Van Der Ploeg',
      NameFormatStyle.lastCommaFirst,
      false,
      'Van Der Ploeg, Jane',
    ],
    [
      'Multiple first names without hyphen (LastCommaFirst)',
      'Jane Sarah',
      undefined,
      'Smith',
      NameFormatStyle.lastCommaFirst,
      false,
      'Smith, Jane Sarah',
    ],
    [
      'Multiple first names with hyphen (LastCommaFirst)',
      'Sarah-Jane',
      undefined,
      'Smith',
      NameFormatStyle.lastCommaFirst,
      false,
      'Smith, Sarah-Jane',
    ],
    ['Basic name (firstLast)', 'Sarah', undefined, 'Smith', NameFormatStyle.firstLast, false, 'Sarah Smith'],
    [
      'Double-barelled last name (firstLast)',
      'Sarah',
      undefined,
      'Smith-Jones',
      NameFormatStyle.firstLast,
      false,
      'Sarah Smith-Jones',
    ],
    [
      'Two last names (firstLast)',
      'Sarah',
      undefined,
      'Smith Jones',
      NameFormatStyle.firstLast,
      false,
      'Sarah Smith Jones',
    ],
    [
      'Two first names (firstLast)',
      'Sarah Jane',
      undefined,
      'Smith',
      NameFormatStyle.firstLast,
      false,
      'Sarah Jane Smith',
    ],
    [
      'Two first names with hyphen (firstLast)',
      'Sarah-Jane',
      undefined,
      'Smith',
      NameFormatStyle.firstLast,
      false,
      'Sarah-Jane Smith',
    ],
    [
      'First and last names (LastCommaFirstMiddle)',
      'John',
      undefined,
      'Smith',
      NameFormatStyle.lastCommaFirstMiddle,
      false,
      'Smith, John',
    ],
    [
      'First and last names (lastCommaFirst)',
      'John',
      undefined,
      'Smith',
      false,
      NameFormatStyle.lastCommaFirst,
      'John Smith',
    ],
    ['First and last names (no style)', 'John', undefined, 'Smith', false, undefined, 'John Smith'],
    [
      'All names (LastCommaFirstMiddle)',
      'John',
      'James',
      'Smith',
      NameFormatStyle.lastCommaFirstMiddle,
      false,
      'Smith, John James',
    ],
    ['Apostrophe (no style)', 'JOHN', 'JAMES', "O'sullivan", undefined, false, "John James O'Sullivan"],
  ])(
    '%s: formatName(%s, %s, %s, %s, %s, %s, %s)',
    (
      _: string,
      firstName: string,
      middleNames: string,
      lastName: string,
      nameFormatStyle: NameFormatStyle,
      boldLastName: boolean,
      expected: string,
    ) => {
      expect(formatName(firstName, middleNames, lastName, nameFormatStyle, boldLastName)).toEqual(expected)
    },
  )
})

describe('format first & lastName', () => {
  it.each([
    ['Lower case', 'robert', 'smith', 'Robert Smith'],
    ['Upper case', 'ROBERT', 'SMITH', 'Robert Smith'],
    ['Mixed case', 'RoBErT', 'sMItH', 'Robert Smith'],
    ['Multiple words', 'RobeRT JOhN', 'sMItH', 'Robert John Smith'],
    ['Leading spaces', '  RobeRT', '  smiTH', 'Robert Smith'],
    ['Trailing spaces', 'RobeRT  ', 'SmItH ', 'Robert Smith'],
    ['Single value', 'robert', undefined, 'Robert'],
    ['Single value full name', 'robert smith', undefined, 'Robert Smith'],
    ['Hyphenated', 'Robert-John', 'SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
    ['Sentence', 'John smith is here', undefined, 'John Smith Is Here'],
  ])('%s formatFirstLastName(%s, %s)', (_: string, a: string, b: string, expected: string) => {
    expect(formatFirstLastName(a, b)).toEqual(expected)
  })
})

describe('parseDate', () => {
  it.each([
    ['2022-02-17', undefined, new Date(2022, 1, 17)],
    ['17/02/2022', 'dd/MM/yyyy', new Date(2022, 1, 17)],
  ])('%s parseDate(%s, %s)', (date: string, fmt: string, expected: Date) => {
    expect(parseDate(date, fmt)).toEqual(expected)
  })
})

describe('formatDate', () => {
  it('formats a date to a long date with day', () => {
    expect(formatDate(new Date(2022, 0, 1), 'cccc do LLLL y')).toEqual('Saturday 1st January 2022')
  })

  it('formats a date to a long date with day when inContext not available', () => {
    expect(formatDate(new Date(2022, 0, 1), 'cccc do LLLL y', true)).toEqual('Saturday 1st January 2022')
  })

  it('formats todays date as "today"', () => {
    expect(formatDate(new Date(), '', true)).toEqual('today')
  })

  it('formats yesterdays date as "yesterday"', () => {
    expect(formatDate(subDays(new Date(), 1), '', true)).toEqual('yesterday')
  })

  it('formats tomorrows date as "tomorrow"', () => {
    expect(formatDate(addDays(new Date(), 1), '', true)).toEqual('tomorrow')
  })

  it('formats a date in string format', () => {
    expect(formatDate('2022-01-01', 'cccc do LLLL y')).toEqual('Saturday 1st January 2022')
  })
})
