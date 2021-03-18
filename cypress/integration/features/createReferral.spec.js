/// <reference types="cypress" />
context('Create referral', () => {
  describe('Ignored resident form', () => {
    before(() => {
      cy.visit('/');
      cy.injectAxe();
    });

    xit('resident form is hidden', () => {
      cy.contains('Residents details').should('be.visible');
      cy.contains('#resident-details').should('not.be.visible');
    });

    xit('referral form', () => {
      cy.get('[data-testid=accordion-item]')
        .eq(0)
        .click();

      cy.get('#referral-1-form').should('not.exist');
      cy.get('#referral-1')
        .contains('Refer')
        .click();

      cy.get('#referral-reason-1').type(
        'Sunt in culpa qui officia deserunt mollit anim id est laborum.'
      );
      cy.get('#conversation-notes-1').type('Excepteur sint occaecat cupidatat non proident');
      cy.get('#consent-1').click();
      cy.get('#referer-name-1').type('Tina Belcher');
      cy.get('#referer-organisation-1').type("Bob's Burgers");
      cy.get('#referer-email-1').type('tina@bburgers.com');
      cy.get('#submit-1').click();

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

    xit('resident form is hidden', () => {
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

    xit('referral form', () => {
      cy.get('[data-testid=accordion-item]')
        .eq(0)
        .click();

      cy.get('#referral-1-form').should('not.exist');
      cy.get('#referral-1')
        .contains('Refer')
        .click();

      cy.get('#submit-1').click();

      cy.get('#referral-reason-1').should('have.class', 'govuk-input--error');
      cy.get('#conversation-notes-1').should('have.class', 'govuk-input--error');

      cy.get('#consent-1-error').should('exist');

      cy.get('#referer-name-1').should('have.class', 'govuk-input--error');
      cy.get('#referer-organisation-1').should('have.class', 'govuk-input--error');
      cy.get('#referer-email-1').should('have.class', 'govuk-input--error');
    });
  });
});
