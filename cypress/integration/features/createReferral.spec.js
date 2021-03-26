/// <reference types="cypress" />
context('Create referral', () => {});

describe('Referral form', () => {
  before(() => {
    cy.visit('/');
    cy.get('[data-testid=accordion-item]')
      .eq(0)
      .click();
  });

  it('Collapses other referral forms if a new form is expanded', () => {
    cy.get('#referral-ABC123-form').should('not.exist');

    cy.get('#referral-ABC123-1').click();
    cy.get('#referral-ABC123-1-form').should('exist');

    cy.get('#referral-abc-1').click();

    cy.get('#referral-ABC123-1-form').should('not.exist');

    cy.get('[data-testid=accordion-item]')
      .eq(1)
      .click();

    cy.get('#referral-abc-2').click();

    cy.get('#referral-abc-2-form').should('exist');

    cy.get('#referral-abc-1-form').should('not.exist');
  });

  it('Services without and email do not have a refer button', () => {
    cy.get('#referral-1-2').should('not.exist');
  });

  it('Renders hidden referral fields', () => {
    cy.get('#service-name-abc')
      .should('not.be.visible')
      .and('have.value', 'Kingsman');

    cy.get('#service-contact-email-abc')
      .should('not.be.visible')
      .and('have.value', 'service@test.testy.com');

    cy.get('#service-contact-phone-abc')
      .should('not.be.visible')
      .and('have.value', '123456789');

    cy.get('#service-referral-email-abc')
      .should('not.be.visible')
      .and('have.value', 'elena@madetech.com');

    cy.get('#service-address-abc')
      .should('not.be.visible')
      .and('have.value', '1 test Rd, London');

    cy.get('#service-websites-abc')
      .should('not.be.visible')
      .and('have.value', 'https://sample.com/test_kingsman');
  });

  it('Persists referral information across different referral fields', () => {
    cy.get('#referral-ABC123-1').click();

    cy.get('#referral-reason-ABC123').type('First referral reason value');
    cy.get('#conversation-notes-ABC123').type('First conversation notes value');

    cy.get('#referral-abc-1').click();
    cy.get('#referral-reason-abc').should('have.value', 'First referral reason value');
    cy.get('#conversation-notes-abc').should('have.value', 'First conversation notes value');
  });

  it('Persists referrer information across different referral fields', () => {
    cy.get('#referral-ABC123-1').click();

    cy.get('#referer-name-ABC123').type('Tina Belcher');
    cy.get('#referer-organisation-ABC123').type("Bob's Burgers");
    cy.get('#referer-email-ABC123').type('perm-fail@simulator.notify');

    cy.get('#referral-abc-1').click();
    cy.get('#referer-name-abc').should('have.value', 'Tina Belcher');
    cy.get('#referer-organisation-abc').should('have.value', "Bob's Burgers");
    cy.get('#referer-email-abc').should('have.value', 'perm-fail@simulator.notify');
  });

  describe('Validation', () => {
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

  describe('Error handling', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.get('[data-testid=accordion-item]')
        .eq(0)
        .click();
      cy.get('#referral-ABC123-1').click();
      cy.get('#firstName').type('Luna');
      cy.get('#lastName').type('Kitty');
      cy.get('#phone').type('07700900000');
      cy.get('#email').type('luna@meow.com');
      cy.get('#address').type('159 Cute Street');
      cy.get('#postcode').type('M3 0W');

      cy.get('#referral-reason-ABC123').type(
        'Sunt in culpa qui officia deserunt mollit anim id est laborum.'
      );
      cy.get('#conversation-notes-ABC123').type('Excepteur sint occaecat cupidatat non proident');
      cy.get('#consent-ABC123').click();
      cy.get('#referer-name-ABC123').type('Tina Belcher');
      cy.get('#referer-organisation-ABC123').type("Bob's Burgers");
    });
    it('Displays a success message if referral is made', () => {
      cy.intercept('/api/referrals', {
        status: 201,
        body: {
          id: '123',
          errors: []
        }
      });
      cy.get('#referer-email-ABC123').type('simulate-delivered@test.com');
      cy.get('#submit-ABC123').click();
      cy.get(`[data-testid=successful-referral-banner]`).should('be.visible');
    });

    it('Displays error message if refferal fails', () => {
      cy.intercept('/api/referrals', {
        status: 201,
        body: {
          id: '123',
          errors: ['error']
        }
      });
      cy.get('#referer-email-ABC123').type('perm-fail@test.com');
      cy.get('#submit-ABC123').click({ force: true });
      cy.get(`[data-testid=referral-errors-banner]`).should('be.visible');
    });
  });
});
