/// <reference types="cypress" />
context('Create referral', () => {});
before(() => {
  cy.visit('/support-a-resident');
});
describe('Referral form', () => {
  beforeEach(() => {
    cy.injectAxe();
  });

  it('Collapses other referral forms if a new form is expanded', () => {
    cy.get('[data-testid=category-checkbox]')
      .eq(0)
      .click();

    cy.get('[data-testid="keyword-search-button"]').click();

    cy.get('#referral-ABC123-form').should('not.exist');

    cy.get('#referral-ABC123').click();
    cy.get('#referral-ABC123-form').should('exist');

    cy.get('#referral-abc').click();

    cy.get('#referral-ABC123-form').should('not.exist');

    cy.get('[data-testid=category-checkbox]')
      .eq(0)
      .click();

    cy.get('[data-testid=category-checkbox]')
      .eq(1)
      .click();

    cy.get('[data-testid="keyword-search-button"]').click();

    cy.get('#referral-abc').click();

    cy.get('#referral-abc-form').should('exist');
  });

  it('Services without and email do not have a refer button', () => {
    cy.get('#referral-1').should('not.exist');
  });

  it('Renders hidden referral fields', () => {
    cy.get('[data-testid=category-checkbox]')
      .eq(1)
      .click();

    cy.get('[data-testid="keyword-search-button"]').click();

    cy.get('#referral-abc').click();

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
    cy.get('[data-testid=category-checkbox]')
      .eq(0)
      .click();

    cy.get('[data-testid="keyword-search-button"]').click();
    cy.get('#referral-ABC123').click();

    cy.get('#referral-reason-ABC123').type('First referral reason value');
    cy.get('#conversation-notes-ABC123').type('First conversation notes value');

    cy.get('#referral-abc').click();
    cy.get('#referral-reason-abc').should('have.value', 'First referral reason value');
    cy.get('#conversation-notes-abc').should('have.value', 'First conversation notes value');
  });

  it('Persists referrer information across different referral fields', () => {
    cy.get('#referral-ABC123').click();

    cy.get('#referer-name-ABC123').type('Tina Belcher');
    cy.get('#referer-organisation-ABC123').should('have.value', 'Hackney Council');
    cy.get('#referer-email-ABC123').type('perm-fail@simulator.notify');

    cy.get('#referral-abc').click();
    cy.get('#referer-name-abc').should('have.value', 'Tina Belcher');
    cy.get('#referer-organisation-abc').should('have.value', 'Hackney Council');
    cy.get('#referer-email-abc').should('have.value', 'perm-fail@simulator.notify');

    cy.runCheckA11y();
  });

  describe('Validation', () => {
    before(() => {
      cy.visit('/support-a-resident');
      cy.injectAxe();
    });

    it('resident form validation', () => {
      cy.get('[data-testid=category-checkbox]')
        .eq(0)
        .click();

      cy.get('[data-testid="keyword-search-button"]').click();

      cy.get('#referral-ABC123-form').should('not.exist');
      cy.get('#referral-ABC123')
        .contains('Refer')
        .click();

      cy.get('#submit-ABC123').click();

      cy.get('#firstName').should('have.class', 'govuk-input--error');
      cy.get('#lastName').should('have.class', 'govuk-input--error');
      cy.get('#phone').should('have.class', 'govuk-input--error');
      cy.get('#address').should('have.class', 'govuk-input--error');
      cy.get('#postcode').should('have.class', 'govuk-input--error');
      cy.get('#date-of-birth-day').should('have.class', 'govuk-input--error');
      cy.get('#date-of-birth-month').should('have.class', 'govuk-input--error');
      cy.get('#date-of-birth-year').should('have.class', 'govuk-input--error');

      cy.runCheckA11y();
    });

    it('referrer form validation', () => {
      cy.get('#referral-reason-ABC123').should('have.class', 'govuk-input--error');
      cy.get('#conversation-notes-ABC123').should('have.class', 'govuk-input--error');

      cy.get('#consent-ABC123-error').should('exist');

      cy.get('#referer-name-ABC123').should('have.class', 'govuk-input--error');
      cy.get('#referer-email-ABC123').should('have.class', 'govuk-input--error');
    });
  });

  describe('Ending a conversation and error handling', () => {
    before(() => {
      cy.visit('/support-a-resident');
      cy.injectAxe();

      cy.get('[data-testid=category-checkbox]')
        .eq(0)
        .click();

      cy.get('[data-testid="keyword-search-button"]').click();
      cy.get('#referral-ABC123').click({ force: true });
      cy.get('#firstName').type('Luna');
      cy.get('#lastName').type('Kitty');
      cy.get('#phone').type('07700900000');
      cy.get('#email').type('luna@meow.com');
      cy.get('#address').type('159 Cute Street');
      cy.get('#postcode').type('M3 0WW');
      cy.get('#date-of-birth-day').type('13');
      cy.get('#date-of-birth-month').type('5');
      cy.get('#date-of-birth-year').type('1985');

      cy.get(
        '#referral-reason-ABC123'
      ).type('Sunt in culpa qui officia deserunt mollit anim id est laborum.', { force: true });

      cy.get('#conversation-notes-ABC123').type('Excepteur sint occaecat cupidatat non proident', {
        force: true
      });

      cy.get('#consent-ABC123').click({ force: true });
      cy.get('#referer-name-ABC123').type('Tina Belcher', {
        force: true
      });
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

    it('Displays continue call or finish call after a referral was successfully submitted', () => {
      cy.get(`[data-testid=continue-call-button]`).should('be.visible');
      cy.get(`[data-testid=finish-call-button]`).should('be.visible');

      cy.runCheckA11y();
    });

    it('Persists the data across referrals if continue call is selected', () => {
      cy.get(`[data-testid=continue-call-button]`).click({ force: true });

      cy.get('[data-testid=category-checkbox]')
        .eq(1)
        .click({ force: true });

      cy.get('[data-testid="keyword-search-button"]').click();
      cy.get('#referral-abc').click({ force: true });

      cy.get('#firstName').should('have.value', 'Luna');
      cy.get('#lastName').should('have.value', 'Kitty');
      cy.get('#phone').should('have.value', '07700900000');
      cy.get('#email').should('have.value', 'luna@meow.com');
      cy.get('#address').should('have.value', '159 Cute Street');
      cy.get('#postcode').should('have.value', 'M3 0WW');
      cy.get('#date-of-birth-day').should('have.value', '13');
      cy.get('#date-of-birth-month').should('have.value', '5');
      cy.get('#date-of-birth-year').should('have.value', '1985');
    });

    it('Displays error message if refferal fails', () => {
      cy.intercept('/api/referrals', {
        status: 201,
        body: {
          id: '123',
          errors: ['error']
        }
      });
      cy.get('#consent-abc').click({ force: true });

      cy.get('#submit-abc').click({ force: true });
      cy.get(`[data-testid=referral-errors-banner]`).should('be.visible');
      cy.runCheckA11y();
    });

    it('Displays continue call or finish call after a referral was unsuccessfully submitted', () => {
      cy.get(`[data-testid=continue-call-button]`).should('be.visible');
      cy.get(`[data-testid=finish-call-button]`).should('be.visible');

      cy.runCheckA11y();
    });

    it('Does not persist the data across referrals if continue call is not selected', () => {
      cy.get('[data-testid=category-checkbox]')
        .eq(2)
        .click();

      cy.get('[data-testid="keyword-search-button"]').click();
      cy.get('#referral-6661hZ8POgMfnWtJt').click({ force: true });

      cy.get('#firstName').should('have.value', '');
      cy.get('#lastName').should('have.value', '');
      cy.get('#phone').should('have.value', '');
      cy.get('#email').should('have.value', '');
      cy.get('#address').should('have.value', '');
      cy.get('#postcode').should('have.value', '');
      cy.get('#date-of-birth-day').should('have.value', '');
      cy.get('#date-of-birth-month').should('have.value', '');
      cy.get('#date-of-birth-year').should('have.value', '');
    });

    it('Persists the data to summary if continue call is selected', () => {
      cy.get('[data-testid=category-checkbox]')
        .eq(1)
        .click();

      cy.get('[data-testid="keyword-search-button"]').click();
      cy.get('#referral-abc').click({ force: true });

      cy.get(`[data-testid=continue-call-button]`).click();

      cy.get('#add-to-summary-checkbox-1').click();
      cy.get('#summary-summary-form').click();

      cy.get('#firstName').should('have.value', 'Luna');
      cy.get('#lastName').should('have.value', 'Kitty');
      cy.get('#phone').should('have.value', '07700900000');
      cy.get('#email').should('have.value', 'luna@meow.com');
      cy.get('#address').should('have.value', '159 Cute Street');
      cy.get('#postcode').should('have.value', 'M3 0WW');
      cy.get('#date-of-birth-day').should('have.value', '13');
      cy.get('#date-of-birth-month').should('have.value', '5');
      cy.get('#date-of-birth-year').should('have.value', '1985');

      cy.runCheckA11y();
    });

    it('Page is reloaded if finish call is selected', () => {
      cy.get('#referral-abc').click({ force: true });

      cy.get(`[data-testid=finish-call-button]`).click();

      cy.get('[data-testid="search-results-header"]').should('not.exist');
    });
  });
});
