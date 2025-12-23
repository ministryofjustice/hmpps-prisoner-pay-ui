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
      id: 'a1a11111-1a11-1111-1a11-1a1aa11a1111',
      prisonCode: 'PVI',
      prisonerNumber: 'A1234AA',
      firstName: 'Nicaigh',
      lastName: 'Johnustine',
      cellLocation: 'A-1-002',
      type: 'LONG_TERM_SICK',
      startDate: '2025-08-12',
      endDate: '2025-09-14',
      createdBy: 'USER1',
      createdDateTime: '2025-07-18T12:45:11',
    }
  }

  static PayStatusPeriods() {
    return [
      {
        id: 'a1a11111-1a11-1111-1a11-1a1aa11a1111',
        prisonCode: 'PVI',
        prisonerNumber: 'A1234AA',
        firstName: 'Nicaigh',
        lastName: 'Johnustine',
        cellLocation: 'A-1-002',
        type: 'LONG_TERM_SICK',
        startDate: '2025-08-12',
        endDate: '2025-09-14',
        createdBy: 'USER1',
        createdDateTime: '2025-07-18T12:45:11',
      },
      {
        id: 'b2b22222-2b22-2222-2bbb-2b2bb22b2222',
        prisonCode: 'PVI',
        prisonerNumber: 'A1234AB',
        firstName: 'Yferttoper',
        lastName: 'Johnny',
        cellLocation: 'A-1-002',
        type: 'LONG_TERM_SICK',
        startDate: '2025-05-03',
        endDate: '2026-03-11',
        createdBy: 'USER1',
        createdDateTime: '2025-07-18T12:45:11',
      },
      {
        id: 'c3c33333-3c33-3333-3cc-3c3cc33c3333',
        prisonCode: 'PVI',
        prisonerNumber: 'A1234AC',
        firstName: 'Frenimen',
        lastName: 'Johnster',
        cellLocation: 'A-1-002',
        type: 'LONG_TERM_SICK',
        startDate: '2025-07-23',
        endDate: '2025-12-31',
        createdBy: 'USER1',
        createdDateTime: '2025-07-18T12:45:11',
      },
    ]
  }
}
