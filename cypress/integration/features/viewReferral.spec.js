/// <reference types="cypress" />
context('view referral', () => {
  it('navigates to individual referral page when link is clicked', () => {
    cy.setHackneyCookie(true);
    cy.visit('/my-view');
    cy.get('[data-testid=referrals-table-recerence-number] > a')
      .eq(1)
      .click({ force: true });

    cy.url().should('include', '/referrals/124');

    cy.get('[data-testid=individual-referral-header]').should('contain', 'Referral for some name');

    cy.injectAxe();
    cy.runCheckA11y();
  });

  it('navigates back to my view when back is clicked', () => {
    cy.setHackneyCookie(true);
    cy.get('[data-testid=back-button]').click({ force: true });

    cy.url().should('include', '/my-view');

    cy.injectAxe();
    cy.runCheckA11y();
  });
});
