context('Snapshot summary', () => {
  var dob = new Date();

  beforeEach(() => {
    dob.setYear(dob.getFullYear() - 20);

    cy.task('createSnapshot', {
      firstName: 'Ferb',
      lastName: 'Flynn',
      assets: [{ name: 'Asset' }],
      notes: ['Notes notes'],
      createdBy: 'Kat',
      postcode: 'AB 123',
      systemIds: ['dub'],
      created: '2020-06-09T15:46:47.857Z',
      dob,
      vulnerabilities: [
        {
          name: 'Vulnerability',
          data: [{ id: 'one', label: 'One', value: 'the value' }]
        }
      ],
      id: '2'
    });

    cy.task('createSnapshot', {
      firstName: 'Candace',
      lastName: 'Flynn',
      assets: [],
      notes: ['Notes notes'],
      createdBy: 'Kat',
      postcode: 'AB 123',
      systemIds: ['dub'],
      created: '2020-06-09T15:46:47.857Z',
      dob: '2000-06-09T15:46:47.857Z',
      vulnerabilities: [],
      id: '3'
    });

    cy.setHackneyCookie(true);
  });

  afterEach(() => {
    cy.task('deleteSnapshot', '2');
    cy.task('deleteSnapshot', '3');
  });
  describe('View snapshot', () => {
    it('Displays a read only view of a snapshot', () => {
      cy.visit(`/snapshots/2`);

      cy.get('h1').should('contain', 'Ferb Flynn');

      cy.get('[data-testid=age-and-date-of-birth]').should(
        'contain',
        `Aged 20`
      );

      cy.get('[data-testid=vulnerabilities-summary]')
        .should('contain', 'Vulnerabilities')
        .and('contain', 'Vulnerability')
        .and('contain', 'One: the value');

      cy.get('[data-testid=assets-summary]')
        .should('contain', 'Assets')
        .and('contain', 'Asset');

      cy.get('[data-testid=notes-summary]')
        .should('contain', 'Notes')
        .and('contain', 'Notes notes');
    });

    it('Displays none captured if there are no vulnerabilities or assets', () => {
      cy.visit(`/snapshots/3`);

      cy.get('h1').should('contain', 'Candace Flynn');

      cy.get('[data-testid=vulnerabilities-summary]')
        .should('contain', 'Vulnerabilities')
        .and('contain', 'None captured');

      cy.get('[data-testid=assets-summary]')
        .should('contain', 'Assets')
        .and('contain', 'None captured');
    });
  });
});
