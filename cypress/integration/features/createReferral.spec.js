/// <reference types="cypress" />
context('Create referral', () => {
  describe('Ignored resident form', () => {
    before(() => {
      cy.visit('/');
      cy.injectAxe();
    });

    it('resident form is hidden', () => {
      cy.contains('Residents details').should('be.visible');
      cy.get('#resident-details').should('not.be.visible');
    });

    it('referral form', () => {
      cy.get('[data-testid=accordion-item]')
        .eq(0)
        .click();

      cy.get('#referral-ABC123-1-form').should('not.exist');
      cy.get('#referral-ABC123-1')
        .contains('Refer')
        .click();

      cy.get('#referral-reason-ABC123').type(
        'Sunt in culpa qui officia deserunt mollit anim id est laborum.'
      );
      cy.get('#conversation-notes-ABC123').type('Excepteur sint occaecat cupidatat non proident');
      cy.get('#consent-ABC123').click();
      cy.get('#referer-name-ABC123').type('Tina Belcher');
      cy.get('#referer-organisation-ABC123').type("Bob's Burgers");
      cy.get('#referer-email-ABC123').type('tina@bburgers.com');
      cy.get('#submit-ABC123').click();

      cy.get('#firstName').should('have.class', 'govuk-input--error');
      cy.get('#lastName').should('have.class', 'govuk-input--error');
      cy.get('#phone').should('have.class', 'govuk-input--error');
      cy.get('#email').should('have.class', 'govuk-input--error');
      cy.get('#address').should('have.class', 'govuk-input--error');
      cy.get('#postcode').should('have.class', 'govuk-input--error');
    });
  });

  describe('Ignored referral form', () => {
    before(() => {
      cy.visit('/');
      cy.injectAxe();
    });

    it('resident form is hidden', () => {
      cy.contains('Residents details')
        .should('be.visible')
        .click();

      cy.get('#firstName').type('Luna');
      cy.get('#lastName').type('Kitty');
      cy.get('#phone').type('07123456789');
      cy.get('#email').type('luna@meow.com');
      cy.get('#address').type('159 Cute Street');
      cy.get('#postcode').type('M3 0W');
    });

    it('referral form', () => {
      cy.get('[data-testid=accordion-item]')
        .eq(0)
        .click();

      cy.get('#referral-ABC123-1-form').should('not.exist');
      cy.get('#referral-ABC123-1')
        .contains('Refer')
        .click();

      cy.get('#submit-ABC123').click();

      cy.get('#referral-reason-ABC123').should('have.class', 'govuk-input--error');
      cy.get('#conversation-notes-ABC123').should('have.class', 'govuk-input--error');

      cy.get('#consent-ABC123-error').should('exist');

      cy.get('#referer-name-ABC123').should('have.class', 'govuk-input--error');
      cy.get('#referer-organisation-ABC123').should('have.class', 'govuk-input--error');
      cy.get('#referer-email-ABC123').should('have.class', 'govuk-input--error');
    });
  });
});
