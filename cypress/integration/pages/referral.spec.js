/// <reference types="cypress" />
context('my view page', () => {
  it('Shows resident name in the referral header', () => {
    cy.setHackneyCookie(true, 'cat.litter.boxes@catheaven.com');
    cy.visit('/referrals/1233');
    cy.injectAxe();

    cy.get('[data-testid=individual-referral-header]').should('contain', 'Referral for other name');
    cy.runCheckA11y();
  });

  it('shows service and referral status in subheader', () => {
    cy.get('[data-testid=individual-referral-hint]').should('contain', 'To service name 2');
    cy.get('[data-testid=individual-referral-hint]').should('contain', 'Rejected');
  });

  it('shows resident details', () => {
    cy.get('[data-testid=resident-details-summary-list]')
      .children()
      .eq(0)
      .should('contain', 'First name')
      .and('contain', 'other');

    cy.get('[data-testid=resident-details-summary-list]')
      .children()
      .eq(1)
      .should('contain', 'Last name')
      .and('contain', 'name');

    cy.get('[data-testid=resident-details-summary-list]')
      .children()
      .eq(2)
      .should('contain', 'Telephone number')
      .and('contain', '32');

    cy.get('[data-testid=resident-details-summary-list]')
      .children()
      .eq(3)
      .should('contain', 'Email address')
      .and('contain', 'john.wick@mailinator.com');

    cy.get('[data-testid=resident-details-summary-list]')
      .children()
      .eq(4)
      .should('contain', 'Address')
      .and('contain', `Amhurst Road\nFlat 5B\nHackney\nE81LL`);
  });

  it('shows referral details', () => {
    cy.get('[data-testid=referral-details-summary-list]')
      .children()
      .eq(0)
      .should('contain', 'Reason for referral')
      .and('contain', 'Desperately needs any vacuuming service for shedded cat fur.');

    cy.get('[data-testid=referral-details-summary-list]')
      .children()
      .eq(1)
      .should('contain', 'Reason for rejection')
      .and('contain', 'comment');

    cy.get('[data-testid=referral-details-summary-list]')
      .children()
      .eq(2)
      .should('contain', 'Notes on wider conversation')
      .and('contain', "Resident says: 'fur in the air, fur in the lungs, fur in the pie...'.");
  });

  it('shows organisation details', () => {
    cy.get('[data-testid=organisation-details-summary-list]')
      .children()
      .eq(0)
      .should('contain', 'Org referred to')
      .and('contain', 'service name 2');

    cy.get('[data-testid=organisation-details-summary-list]')
      .children()
      .eq(1)
      .should('contain', 'Telephone number')
      .and('contain', '02022159138');

    cy.get('[data-testid=organisation-details-summary-list]')
      .children()
      .eq(2)
      .should('contain', 'Email address')
      .and('contain', 'santechninis.vamzdis@vamzsaulis.com');

    cy.get('[data-testid=organisation-details-summary-list]')
      .children()
      .eq(3)
      .should('contain', 'Address')
      .and('contain', '15 Markmanor Ave\nOtherCouncil\nE17 8HJ');
  });
});
