context('Referral summary', () => {
  var dob = new Date();

  beforeEach(() => {
    dob.setYear(dob.getFullYear() - 20);

    cy.task('createReferral', {
      firstName: 'Ferb',
      lastName: 'Flynn',
      assets: [{ name: 'Asset' }],
      notes: ['Notes notes'],
      createdBy: 'Kat',
      postcode: 'E1 6AW',

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

    cy.task('createReferral', {
      firstName: 'Candace',
      lastName: 'Flynn',
      assets: [],
      notes: ['Notes notes'],
      createdBy: 'Kat',
      postcode: 'E1 6AW',
      systemIds: ['dub'],
      created: '2020-06-09T15:46:47.857Z',
      dob: '2000-06-09T15:46:47.857Z',
      vulnerabilities: [],
      id: '3'
    });

    cy.setHackneyCookie(true);
  });

  afterEach(() => {
    cy.task('deleteReferral', '2');
    cy.task('deleteReferral', '3');
  });
  describe('View referral', () => {
    xit('Displays a read only view of a referral', () => {
      cy.visit(`/referrals/2`);

      cy.get('h1').should('contain', `Ferb's resources`);

      cy.get('#example-search').should('not.exist');

      cy.get('[data-testid=age-and-date-of-birth]').should('contain', `Aged 20`);

      cy.get('[data-testid=vulnerabilities-summary]')
        .should('contain', 'Vulnerabilities')
        .and('contain', 'Vulnerability')
        .and('contain', 'One: the value');

      cy.get('[data-testid=assets-summary]')
        .should('contain', 'Strengths identified')
        .and('contain', 'Asset');

      cy.get('[data-testid=notes-summary]')
        .should('contain', 'Notes')
        .and('contain', 'Notes notes');

      // And I can continue back to INH
      cy.get('[data-testid=continue-link-to-inh]')
        .should('contain', 'Continue')
        .and(
          'have.attr',
          'href',
          'https://inh-admin-test.hackney.gov.uk/help-requests/complete/dub'
        );
    });

    xit('Displays none captured if there are no vulnerabilities or assets', () => {
      cy.visit(`/referrals/3`);

      cy.get('h1').should('contain', `Candace's resources`);

      cy.get('[data-testid=vulnerabilities-summary]')
        .should('contain', 'Vulnerabilities')
        .and('contain', 'None captured');

      cy.get('[data-testid=assets-summary]')
        .should('contain', 'Strengths identified')
        .and('contain', 'None captured');
    });
  });
});