/// <reference types="cypress" />
context('Create summary', () => {
  const referrerName = 'Tina Belcher';
  const refererOrganisation = 'Hackney Council';
  const referrerEmail = 'tina@bburgers.com';

  before(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('displays error message when no services are selected', () => {
    cy.get('#summary-summary-form').click();

    cy.get('#summary-form').should('not.exist');

    cy.get('#summary-error')
      .contains('Please make a referral or choose at least one service to add to summary')
      .should('be.visible');
  });

  it('adds selected services to summary', () => {
    cy.get('[data-testid=category-card]')
      .eq(1)
      .click();

    cy.get('[data-testid=added-to-summary-banner-1-2]').should('not.exist');

    cy.get('#add-to-summary-checkbox-1-2').click();

    cy.get('[data-testid=added-to-summary-banner-1-2]').should('exist');

    cy.get('#summary-summary-form').click();

    cy.get('#summary-error').should('not.exist');

    cy.get('#firstName').type('Luna');
    cy.get('#lastName').type('Kitty');
    cy.get('#phone').type('07123456789');
    cy.get('#email').type('luna@meow.com');
    cy.get('#address').type('159 Cute Street');
    cy.get('#postcode').type('M3 0W');

    cy.get('#support-summary-note').should(
      'have.value',
      'If you wish to reply to this email please respond to referrer at \n  \n  Hi Luna Kitty,\n' +
        '\n' +
        'We discussed the following services in our conversation today:\n' +
        '    1. First service\n' +
        '    07000 0000000 ' +
        '\n' +
        '    help@gmail.com ' +
        '\n' +
        '    404 error, not, found ' +
        '\n' +
        '    https://www.sample.org.uk ' +
        ' \n' +
        '\n' +
        '\n' +
        '\n' +
        'Thanks, \n' +
        '\n' +
        '\n' +
        'Hackney Council\n'
    );
  });

  it('add referred services to the summary', () => {
    cy.get('#referral-abc-2').click();

    cy.get('#firstName').type('Luna');
    cy.get('#lastName').type('Kitty');
    cy.get('#phone').type('07123456789');
    cy.get('#email').type('luna@meow.com');
    cy.get('#address').type('159 Cute Street');
    cy.get('#postcode').type('M3 0W');

    cy.get('#referral-reason-abc').type(
      'Sunt in culpa qui officia deserunt mollit anim id est laborum.'
    );
    cy.get('#conversation-notes-abc').type('Excepteur sint occaecat cupidatat non proident');
    cy.get('#consent-abc').click();
    cy.get('#referer-name-abc').type(referrerName);
    cy.get('#referer-organisation-abc').should('have.value', refererOrganisation);

    cy.intercept('/api/referrals', {
      status: 201,
      body: {
        id: '123',
        errors: []
      }
    });
    cy.get('#referer-email-abc').type(referrerEmail);
    cy.get('#submit-abc').click();
    cy.get(`[data-testid=successful-referral-banner]`).should('be.visible');

    cy.get('#support-summary-note').should(
      'have.value',
      'If you wish to reply to this email please respond to Tina Belcher at tina@bburgers.com\n  \n  Hi Luna Kitty,\n' +
        '\n' +
        'We discussed the following services in our conversation today:\n' +
        '    1. First service\n' +
        '    07000 0000000 ' +
        '\n' +
        '    help@gmail.com ' +
        '\n' +
        '    404 error, not, found ' +
        '\n' +
        '    https://www.sample.org.uk ' +
        ' \n' +
        '\n' +
        '\n' +
        'I referred you to the following services:\n' +
        '    1. Kingsman\n' +
        '    123456789 ' +
        '\n' +
        '    service@test.testy.com ' +
        '\n' +
        '    1 test Rd, London ' +
        '\n' +
        '    https://sample.com/test_kingsman ' +
        ' \n' +
        '\n' +
        '\n' +
        'Thanks, \n' +
        `${referrerName}\n` +
        `${referrerEmail}\n` +
        `${refererOrganisation}\n`
    );
  });

  it('referer details are saved to summary', () => {
    cy.get('#summary-name').should('have.value', referrerName);
    cy.get('#summary-email').should('have.value', referrerEmail);
    cy.get('#summary-organisation').should('have.value', refererOrganisation);
  });

  it('can cancel removal of services from summary', () => {
    cy.get('[data-testid=remove-from-summary]')
      .first()
      .click();
    cy.get('[data-testid=remove-from-summary-no]').click();
    cy.get('#support-summary-note').should('contain', 'First service');
  });

  it('can remove services from summary', () => {
    cy.get('[data-testid=remove-from-summary]')
      .first()
      .click();
    cy.get('[data-testid=remove-from-summary-yes]').click();
    cy.get('#support-summary-note').should('not.contain', 'First service');
  });

  it('should display success message', () => {
    cy.intercept('/api/conversations', {
      status: 201,
      body: {
        id: '123',
        errors: []
      }
    });

    cy.get('#summary-submit').click();

    cy.get('#summary-form').should('not.exist');

    cy.get('[data-testid=successful-conversation-banner]')
      .contains('Successfully submitted conversation')
      .should('be.visible');

    cy.get('[data-testid=conversation-competition-msg]')
      .contains('To help another resident please refresh this page')
      .should('be.visible');
  });
});
