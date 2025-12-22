export default class TestData {
  static Prisoner() {
    return {
      prisonerNumber: 'G4529UP',
      status: 'ACTIVE IN',
      firstName: 'NICAIGH',
      lastName: 'JOHNUSTINE',
      cellLocation: 'COURT',
    }
  }

  static Prisoners() {
    return [
      {
        prisonerNumber: 'G4529UP',
        status: 'ACTIVE IN',
        firstName: 'NICAIGH',
        lastName: 'JOHNUSTINE',
        cellLocation: 'COURT',
      },
      {
        prisonerNumber: 'G4701UT',
        firstName: "YF'ERTOPER",
        lastName: 'JOHNUSTINE',
        status: 'ACTIVE IN',
        cellLocation: 'E-S-2-018',
      },
    ]
  }

  static Pagination() {
    return {
      pageable: {
        pageNumber: 0,
        pageSize: 50,
        sort: { empty: true, sorted: false, unsorted: true },
        offset: 0,
        paged: true,
        unpaged: false,
      },
      last: true,
      totalElements: 2,
      totalPages: 1,
      size: 50,
      number: 0,
      first: true,
      sort: { empty: true, sorted: false, unsorted: true },
      numberOfElements: 2,
      empty: false,
    }
  }

  static PayStatusPeriod() {
    return {
      id: 'e6a19788-4f80-4923-8aff-1e5fe26a6139',
      prisonCode: 'PVI',
      prisonerNumber: 'A1234BC',
      type: 'LONG_TERM_SICK',
      startDate: '2025-07-23',
      endDate: '2025-09-14',
      createdBy: 'USER1',
      createdDateTime: '2025-07-18T12:45:11',
    }
  }
}
