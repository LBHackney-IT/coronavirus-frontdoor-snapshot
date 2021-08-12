/// <reference types="cypress" />
context('my view page', () => {
  it('redirects to my view from base url', () => {
    cy.setHackneyCookie(true);
    cy.visit('/');
    cy.injectAxe();

    cy.url().should('include', '/my-view');
    cy.runCheckA11y();
  });

  it('Shows a table with correct number of referrals', () => {
    cy.get('[data-testid=referrals-table-row]').should('have.length', '3');
  });

  it('shows newest referrals first', () => {
    cy.get('[data-testid=referrals-table-recerence-number]')
      .eq(0)
      .should('contain', 'no ref');

    cy.get('[data-testid=referrals-table-recerence-number]')
      .eq(1)
      .should('contain', 'ABC-1');

    cy.get('[data-testid=referrals-table-recerence-number]')
      .eq(2)
      .should('contain', 'E7UK-8');
  });

  it('shows correct referral information', () => {
    cy.get('[data-testid=referrals-table-resident-name]')
      .eq(0)
      .should('contain', 'other name');

    cy.get('[data-testid=referrals-table-resident-name]')
      .eq(1)
      .should('contain', 'some name');

    cy.get('[data-testid=referrals-table-resident-name]')
      .eq(2)
      .should('contain', 'more name');

    cy.get('[data-testid=referrals-table-service-name]')
      .eq(0)
      .should('contain', 'service name 3');

    cy.get('[data-testid=referrals-table-service-name]')
      .eq(1)
      .should('contain', 'service name 2');

    cy.get('[data-testid=referrals-table-service-name]')
      .eq(2)
      .should('contain', 'service name 1');

    cy.get('[data-testid=referrals-table-date-created]')
      .eq(0)
      .should('contain', '24/07/2021');

    cy.get('[data-testid=referrals-table-date-created]')
      .eq(1)
      .should('contain', '12/07/2021');

    cy.get('[data-testid=referrals-table-date-created]')
      .eq(2)
      .should('contain', '02/04/2021');

    cy.get('[data-testid=referrals-table-status]')
      .eq(0)
      .should('contain', 'Accepted');

    cy.get('[data-testid=referrals-table-status]')
      .eq(1)
      .should('contain', 'Rejected');

    cy.get('[data-testid=referrals-table-status]')
      .eq(2)
      .should('contain', 'Pending');
  });

  it('Redirects to support a resident when it is selected from the navigation', () => {
    cy.get('[data-testid=support-a-resident-nav]').click({ force: true });
    cy.url().should('include', '/support-a-resident');
  });
});
